// update types: npx supabase gen types typescript ...
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4";
  };
  public: {
    Tables: {
      booking_count: {
        Row: {
          count: number | null;
          created_at: string;
          id: number;
          type: string | null;
        };
        Insert: {
          count?: number | null;
          created_at?: string;
          id?: number;
          type?: string | null;
        };
        Update: {
          count?: number | null;
          created_at?: string;
          id?: number;
          type?: string | null;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          amount_paid: number | null;
          booking_number: string | null;
          booking_source: string | null;
          checked_in: string | null;
          checked_out: string | null;
          company: string | null;
          created_at: string | null;
          guest_breakdown: Json | null;
          guest_id: string | null;
          id: string;
          number_of_guests: string | null;
          payment_method: string | null;
          payment_status: string | null;
          places_last_visited: string | null;
          purpose: string | null;
          recent_sickness: string | null;
          room_id: string | null;
          room_type_id: string | null;
          special_requests: Json[] | null;
          status: string;
          total: string | null;
          total_add_ons: string | null;
        };
        Insert: {
          amount_paid?: number | null;
          booking_number?: string | null;
          booking_source?: string | null;
          checked_in?: string | null;
          checked_out?: string | null;
          company?: string | null;
          created_at?: string | null;
          guest_breakdown?: Json | null;
          guest_id?: string | null;
          id?: string;
          number_of_guests?: string | null;
          payment_method?: string | null;
          payment_status?: string | null;
          places_last_visited?: string | null;
          purpose?: string | null;
          recent_sickness?: string | null;
          room_id?: string | null;
          room_type_id?: string | null;
          special_requests?: Json[] | null;
          status?: string;
          total?: string | null;
          total_add_ons?: string | null;
        };
        Update: {
          amount_paid?: number | null;
          booking_number?: string | null;
          booking_source?: string | null;
          checked_in?: string | null;
          checked_out?: string | null;
          company?: string | null;
          created_at?: string | null;
          guest_breakdown?: Json | null;
          guest_id?: string | null;
          id?: string;
          number_of_guests?: string | null;
          payment_method?: string | null;
          payment_status?: string | null;
          places_last_visited?: string | null;
          purpose?: string | null;
          recent_sickness?: string | null;
          room_id?: string | null;
          room_type_id?: string | null;
          special_requests?: Json[] | null;
          status?: string;
          total?: string | null;
          total_add_ons?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_guest_id_fkey";
            columns: ["guest_id"];
            isOneToOne: false;
            referencedRelation: "guest";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "rooms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "bookings_room_type_id_fkey";
            columns: ["room_type_id"];
            isOneToOne: false;
            referencedRelation: "room_types";
            referencedColumns: ["id"];
          },
        ];
      };
      feedback: {
        Row: {
          check_in: string;
          check_out: string;
          comments: string | null;
          contact_manager: string | null;
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          rating: number;
          recommend: string;
          room_number: string;
        };
        Insert: {
          check_in: string;
          check_out: string;
          comments?: string | null;
          contact_manager?: string | null;
          created_at?: string;
          email: string;
          full_name: string;
          id?: string;
          rating: number;
          recommend: string;
          room_number: string;
        };
        Update: {
          check_in?: string;
          check_out?: string;
          comments?: string | null;
          contact_manager?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          rating?: number;
          recommend?: string;
          room_number?: string;
        };
        Relationships: [];
      };
      function_hall_bookings: {
        Row: {
          amount_paid: number | null;
          balance: number | null;
          booking_number: string | null;
          booking_source: string | null;
          created_at: string;
          event_duration: Json | null;
          event_end: string | null;
          event_start: string | null;
          event_type: string | null;
          guest_id: string | null;
          id: string;
          notes: string | null;
          number_of_guest: number | null;
          occupancy_type: string | null;
          payment_method: string | null;
          payment_status: string | null;
          room_id: string | null;
          status: string | null;
          total_amount: number | null;
        };
        Insert: {
          amount_paid?: number | null;
          balance?: number | null;
          booking_number?: string | null;
          booking_source?: string | null;
          created_at?: string;
          event_duration?: Json | null;
          event_end?: string | null;
          event_start?: string | null;
          event_type?: string | null;
          guest_id?: string | null;
          id?: string;
          notes?: string | null;
          number_of_guest?: number | null;
          occupancy_type?: string | null;
          payment_method?: string | null;
          payment_status?: string | null;
          room_id?: string | null;
          status?: string | null;
          total_amount?: number | null;
        };
        Update: {
          amount_paid?: number | null;
          balance?: number | null;
          booking_number?: string | null;
          booking_source?: string | null;
          created_at?: string;
          event_duration?: Json | null;
          event_end?: string | null;
          event_start?: string | null;
          event_type?: string | null;
          guest_id?: string | null;
          id?: string;
          notes?: string | null;
          number_of_guest?: number | null;
          occupancy_type?: string | null;
          payment_method?: string | null;
          payment_status?: string | null;
          room_id?: string | null;
          status?: string | null;
          total_amount?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "function_hall_bookings_guest_id_fkey";
            columns: ["guest_id"];
            isOneToOne: false;
            referencedRelation: "guest";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "function_hall_bookings_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "function_rooms";
            referencedColumns: ["id"];
          },
        ];
      };
      function_rooms: {
        Row: {
          created_at: string;
          description: string | null;
          function_hall_bookings: Json[] | null;
          id: string;
          image: string | null;
          max_guest: number | null;
          remarks: string | null;
          room_number: number | null;
          size: string | null;
          status: string | null;
          type: string | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          function_hall_bookings?: Json[] | null;
          id?: string;
          image?: string | null;
          max_guest?: number | null;
          remarks?: string | null;
          room_number?: number | null;
          size?: string | null;
          status?: string | null;
          type?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          function_hall_bookings?: Json[] | null;
          id?: string;
          image?: string | null;
          max_guest?: number | null;
          remarks?: string | null;
          room_number?: number | null;
          size?: string | null;
          status?: string | null;
          type?: string | null;
        };
        Relationships: [];
      };
      guest: {
        Row: {
          address: string | null;
          contact_number: string | null;
          created_at: string;
          email: string | null;
          full_name: string | null;
          gender: string | null;
          id: string;
          nationality: string | null;
          valid_id: Json | null;
        };
        Insert: {
          address?: string | null;
          contact_number?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          gender?: string | null;
          id?: string;
          nationality?: string | null;
          valid_id?: Json | null;
        };
        Update: {
          address?: string | null;
          contact_number?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          gender?: string | null;
          id?: string;
          nationality?: string | null;
          valid_id?: Json | null;
        };
        Relationships: [];
      };
      inventory: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          name: string | null;
          price: number | null;
          quantity: number | null;
          status: string | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string | null;
          price?: number | null;
          quantity?: number | null;
          status?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          name?: string | null;
          price?: number | null;
          quantity?: number | null;
          status?: string | null;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          created_at: string;
          id: number;
          is_read: boolean | null;
          message: string | null;
          title: string | null;
          type: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          is_read?: boolean | null;
          message?: string | null;
          title?: string | null;
          type?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          is_read?: boolean | null;
          message?: string | null;
          title?: string | null;
          type?: string | null;
        };
        Relationships: [];
      };
      room_type_add_ons: {
        Row: {
          created_at: string;
          id: string;
          inventory_id: string | null;
          quantity_limit: number | null;
          room_type_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          inventory_id?: string | null;
          quantity_limit?: number | null;
          room_type_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          inventory_id?: string | null;
          quantity_limit?: number | null;
          room_type_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "room_type_add_ons_inventory_id_fkey";
            columns: ["inventory_id"];
            isOneToOne: false;
            referencedRelation: "inventory";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "room_type_add_ons_room_type_id_fkey";
            columns: ["room_type_id"];
            isOneToOne: false;
            referencedRelation: "room_types";
            referencedColumns: ["id"];
          },
        ];
      };
      room_types: {
        Row: {
          add_ons: Json[] | null;
          created_at: string;
          description: string | null;
          id: string;
          image: string | null;
          images: Json[] | null;
          max_guest: number | null;
          name: string | null;
          peak_season_price: number | null;
          price: number | null;
          room_size: string | null;
        };
        Insert: {
          add_ons?: Json[] | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          image?: string | null;
          images?: Json[] | null;
          max_guest?: number | null;
          name?: string | null;
          peak_season_price?: number | null;
          price?: number | null;
          room_size?: string | null;
        };
        Update: {
          add_ons?: Json[] | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          image?: string | null;
          images?: Json[] | null;
          max_guest?: number | null;
          name?: string | null;
          peak_season_price?: number | null;
          price?: number | null;
          room_size?: string | null;
        };
        Relationships: [];
      };
      "room-reports": {
        Row: {
          created_at: string;
          damage_type: string | null;
          estimated_cost: number | null;
          guest_name: string | null;
          id: string;
          item_category: string | null;
          item_name: string | null;
          notes: string | null;
          quantity: number | null;
          report_date: string | null;
          report_type: string | null;
          reported_by: string | null;
          resolved_date: string | null;
          room_number: string | null;
          status: string | null;
        };
        Insert: {
          created_at?: string;
          damage_type?: string | null;
          estimated_cost?: number | null;
          guest_name?: string | null;
          id?: string;
          item_category?: string | null;
          item_name?: string | null;
          notes?: string | null;
          quantity?: number | null;
          report_date?: string | null;
          report_type?: string | null;
          reported_by?: string | null;
          resolved_date?: string | null;
          room_number?: string | null;
          status?: string | null;
        };
        Update: {
          created_at?: string;
          damage_type?: string | null;
          estimated_cost?: number | null;
          guest_name?: string | null;
          id?: string;
          item_category?: string | null;
          item_name?: string | null;
          notes?: string | null;
          quantity?: number | null;
          report_date?: string | null;
          report_type?: string | null;
          reported_by?: string | null;
          resolved_date?: string | null;
          room_number?: string | null;
          status?: string | null;
        };
        Relationships: [];
      };
      auth_activity_logs: {
        Row: {
          id: string;
          user_id: string | null;
          email: string | null;
          role: string | null;
          event_type: string;
          event_at: string;
          ip_address: string | null;
          user_agent: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          email?: string | null;
          role?: string | null;
          event_type: string;
          event_at?: string;
          ip_address?: string | null;
          user_agent?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          email?: string | null;
          role?: string | null;
          event_type?: string;
          event_at?: string;
          ip_address?: string | null;
          user_agent?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "auth_activity_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      rooms: {
        Row: {
          area: string | null;
          bookings: Json[] | null;
          description: string | null;
          id: string;
          remarks: string | null;
          room_id: string;
          room_number: number;
          room_type_id: string | null;
          status: string;
        };
        Insert: {
          area?: string | null;
          bookings?: Json[] | null;
          description?: string | null;
          id?: string;
          remarks?: string | null;
          room_id: string;
          room_number: number;
          room_type_id?: string | null;
          status?: string;
        };
        Update: {
          area?: string | null;
          bookings?: Json[] | null;
          description?: string | null;
          id?: string;
          remarks?: string | null;
          room_id?: string;
          room_number?: number;
          room_type_id?: string | null;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rooms_room_type_id_fkey";
            columns: ["room_type_id"];
            isOneToOne: false;
            referencedRelation: "room_types";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_available_room_types: {
        Args: { check_in: string; check_out: string; guests: number };
        Returns: {
          add_ons: Json[];
          description: string;
          id: string;
          image: string;
          max_guest: number;
          name: string;
          peak_season_price: number;
          price: number;
          room_size: string;
        }[];
      };
      get_room_availability: {
        Args: {
          check_in: string;
          check_out: string;
          room_status: string;
          room_type_id: string;
          selected_date: string;
        };
        Returns: {
          availability: string;
          id: string;
          room_number: string;
          room_type_id: string;
          status: string;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
