import { createClient } from "@/utils/supabase/server";

/**
 * Utility function to sync room status based on active rentals
 * This can be called periodically or when needed to ensure data consistency
 */
export async function syncRoomStatus() {
    const supabase = await createClient();

    try {
        // Get all rooms
        const { data: rooms, error: roomsError } = await supabase
            .from("houses")
            .select("id, status");

        if (roomsError) throw roomsError;

        // Get all active rentals (with status = 'active')
        const { data: activeRentals, error: rentalsError } = await supabase
            .from("rentals")
            .select("house_id")
            .eq("status", "active");

        if (rentalsError) throw rentalsError;

        const activeRoomIds = new Set(activeRentals?.map(rental => rental.house_id) || []);

        // Update room statuses
        for (const room of rooms || []) {
            const shouldBeOccupied = activeRoomIds.has(room.id);
            const currentlyOccupied = room.status === 'occupied';
            const isMaintenance = room.status === 'maintenance';

            // Only update if status needs to change and room is not in maintenance
            if (!isMaintenance && shouldBeOccupied !== currentlyOccupied) {
                const newStatus = shouldBeOccupied ? 'occupied' : 'available';

                const { error: updateError } = await supabase
                    .from("houses")
                    .update({ status: newStatus })
                    .eq("id", room.id);

                if (updateError) {
                    console.error(`Failed to update room ${room.id} status:`, updateError);
                }
            }
        }

        return { success: true, message: "Room statuses synced successfully" };
    } catch (error) {
        console.error("Error syncing room status:", error);
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}
