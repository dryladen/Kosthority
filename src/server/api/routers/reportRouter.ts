import { z } from "zod";
import { authProcedure, createTRPCRouter } from "../trpc";
import { createClient } from "@/utils/supabase/server";

export const reportRouter = createTRPCRouter({
  // Get payment status for all active rentals
  paymentStatus: authProcedure.query(async () => {
    const supabase = await createClient();
    
    // Get all active rentals with their details
    const { data: rentals, error: rentalError } = await supabase
      .from("rentals")
      .select(`
        id,
        house_id,
        tenant_id,
        move_in,
        move_out,
        monthly_price,
        status,
        houses!inner(name, apartments!inner(name)),
        tenants!inner(name, phone)
      `)
      .eq("status", "active");
    
    if (rentalError) throw new Error(rentalError.message);
    
    // Type cast the rentals to ensure proper typing
    const typedRentals = rentals as unknown as Array<{
      id: string;
      house_id: string;
      tenant_id: string;
      move_in: string;
      move_out: string;
      monthly_price: string;
      status: string;
      houses: { name: string; apartments: { name: string } };
      tenants: { name: string; phone: string };
    }>;
    
    // Get all payments for these rentals
    const rentalIds = typedRentals?.map(r => r.id) || [];
    const { data: payments, error: paymentError } = await supabase
      .from("payments")
      .select("rental_id, amount, for_month")
      .in("rental_id", rentalIds);
    
    if (paymentError) throw new Error(paymentError.message);
    
    // Calculate payment status for each rental
    const paymentStatus = typedRentals?.map(rental => {
      const rentalPayments = payments?.filter(p => p.rental_id === rental.id) || [];
      
      // Calculate months from move_in to previous month
      const moveInDateStr = rental.move_in;
      const [yearStr, monthStr] = moveInDateStr.split('-');
      const moveInYear = parseInt(yearStr);
      const moveInMonth = parseInt(monthStr);
      
      const currentDate = new Date();
      const checkUntilYear = currentDate.getFullYear();
      const checkUntilMonth = currentDate.getMonth() - 1;
      
      let monthCount = 0;
      
      // Create start and end month strings directly without Date object intermediary
      const startMonthStr = `${moveInYear.toString().padStart(4, '0')}-${moveInMonth.toString().padStart(2, '0')}`;
      const endMonthStr = `${checkUntilYear.toString().padStart(4, '0')}-${(checkUntilMonth + 1).toString().padStart(2, '0')}`;
      
      // Create Date objects only for comparison - use UTC to avoid timezone issues
      const startMonth = new Date(Date.UTC(moveInYear, moveInMonth - 1, 1));
      const endMonth = new Date(Date.UTC(checkUntilYear, checkUntilMonth, 1));
      
      for (let d = new Date(startMonth); d <= endMonth; d.setUTCMonth(d.getUTCMonth() + 1)) {
        monthCount++;
      }
      
      const totalMonthsRented = Math.max(1, monthCount);
      
      // Calculate total amount paid and expected
      const totalPaid = rentalPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
      const monthlyPrice = parseFloat(rental.monthly_price);
      const expectedTotal = monthlyPrice * totalMonthsRented;
      
      // Calculate balance
      const balance = totalPaid - expectedTotal;
      
      // Get payment months and amounts
      const paidMonths = rentalPayments.map(p => p.for_month).sort();
      const currentMonth = new Date().toISOString().slice(0, 7);
      
      // Find missing months - only include months that should have been paid
      // Also check if payment amount is sufficient for each month
      const missingMonths = [];
      const partialPaymentMonths = [];
      
      // Use the same startMonth and endMonth from above calculation
      for (let d = new Date(startMonth); d <= endMonth; d.setUTCMonth(d.getUTCMonth() + 1)) {
        const monthStr = d.toISOString().slice(0, 7);
        const monthPayments = rentalPayments.filter(p => p.for_month.startsWith(monthStr));
        const totalPaidForMonth = monthPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
        
        if (monthPayments.length === 0) {
          missingMonths.push(monthStr);
        } else if (totalPaidForMonth < monthlyPrice) {
          partialPaymentMonths.push({
            month: monthStr,
            paid: totalPaidForMonth,
            remaining: monthlyPrice - totalPaidForMonth
          });
        }
      }
      
      return {
        rental,
        totalPaid,
        expectedTotal,
        balance,
        monthlyPrice,
        totalMonthsRented,
        paidMonths: paidMonths.length,
        missingMonths,
        partialPaymentMonths,
        status: balance >= 0 ? (balance > monthlyPrice ? 'overpaid' : 'current') : 'behind',
        lastPayment: rentalPayments.length > 0 ? Math.max(...rentalPayments.map(p => new Date(p.for_month).getTime())) : null
      };
    }) || [];
    
    return paymentStatus;
  }),

  // Get detailed payment history for a specific rental
  rentalPaymentDetail: authProcedure
    .input(z.string().min(1, "Rental ID is required"))
    .query(async ({ input }) => {
      const supabase = await createClient();
      
      // Get rental details
      const { data: rental, error: rentalError } = await supabase
        .from("rentals")
        .select(`
          id,
          house_id,
          tenant_id,
          move_in,
          move_out,
          monthly_price,
          status,
          houses!inner(name, apartments!inner(name)),
          tenants!inner(name, phone)
        `)
        .eq("id", input)
        .single();
      
      if (rentalError) throw new Error(rentalError.message);
      
      // Type cast the rental to ensure proper typing
      const typedRental = rental as unknown as {
        id: string;
        house_id: string;
        tenant_id: string;
        move_in: string;
        move_out: string;
        monthly_price: string;
        status: string;
        houses: { name: string; apartments: { name: string } };
        tenants: { name: string; phone: string };
      };
      
      // Get all payments for this rental
      const { data: payments, error: paymentError } = await supabase
        .from("payments")
        .select("id, amount, for_month, note, created_at")
        .eq("rental_id", input)
        .order("for_month", { ascending: true });
      
      if (paymentError) throw new Error(paymentError.message);
      
      return {
        rental: typedRental,
        payments: payments || []
      };
    }),
});
