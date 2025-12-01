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
      archives: {
        Row: {
          check_in: string | null;
          check_out: string | null;
          company: string | null;
          created_at: string | null;
          guest_id: string | null;
          id: string;
          number_of_guests: string | null;
          places_last_visited: string | null;
          purpose: string | null;
          room_id: string | null;
          room_type_id: string | null;
          special_requests: Json[] | null;
          status: string;
          total: string | null;
          total_add_ons: string | null;
        };
        Insert: {
          check_in?: string | null;
          check_out?: string | null;
          company?: string | null;
          created_at?: string | null;
          guest_id?: string | null;
          id?: string;
          number_of_guests?: string | null;
          places_last_visited?: string | null;
          purpose?: string | null;
          room_id?: string | null;
          room_type_id?: string | null;
          special_requests?: Json[] | null;
          status?: string;
          total?: string | null;
          total_add_ons?: string | null;
        };
        Update: {
          check_in?: string | null;
          check_out?: string | null;
          company?: string | null;
          created_at?: string | null;
          guest_id?: string | null;
          id?: string;
          number_of_guests?: string | null;
          places_last_visited?: string | null;
          purpose?: string | null;
          room_id?: string | null;
          room_type_id?: string | null;
          special_requests?: Json[] | null;
          status?: string;
          total?: string | null;
          total_add_ons?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "archives_guest_id_fkey";
            columns: ["guest_id"];
            isOneToOne: false;
            referencedRelation: "guest";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "archives_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "rooms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "archives_room_type_id_fkey";
            columns: ["room_type_id"];
            isOneToOne: false;
            referencedRelation: "room_types";
            referencedColumns: ["id"];
          },
        ];
      };
      banquet_menus: {
        Row: {
          category: string | null;
          created_at: string;
          id: string;
          name: string | null;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          id?: string;
          name?: string | null;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          id?: string;
          name?: string | null;
        };
        Relationships: [];
      };
      banquet_packages: {
        Row: {
          created_at: string;
          id: string;
          menus: string[] | null;
          name: string | null;
          price: number | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          menus?: string[] | null;
          name?: string | null;
          price?: number | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          menus?: string[] | null;
          name?: string | null;
          price?: number | null;
        };
        Relationships: [];
      };
      booking_count: {
        Row: {
          count: number | null;
          created_at: string;
          id: number;
        };
        Insert: {
          count?: number | null;
          created_at?: string;
          id?: number;
        };
        Update: {
          count?: number | null;
          created_at?: string;
          id?: number;
        };
        Relationships: [];
      };
      bookings: {
        Row: {
          amount_paid: number | null;
          booking_number: string | null;
          booking_source: string | null;
          check_in: string | null;
          check_out: string | null;
          company: string | null;
          created_at: string | null;
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
          check_in?: string | null;
          check_out?: string | null;
          company?: string | null;
          created_at?: string | null;
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
          check_in?: string | null;
          check_out?: string | null;
          company?: string | null;
          created_at?: string | null;
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
      function_hall_bookings: {
        Row: {
          banquet_package_id: string | null;
          created_at: string;
          event_date: string | null;
          event_duration: Json | null;
          event_type: string | null;
          guest_id: string | null;
          id: string;
          notes: string | null;
          room_id: string | null;
          status: string | null;
        };
        Insert: {
          banquet_package_id?: string | null;
          created_at?: string;
          event_date?: string | null;
          event_duration?: Json | null;
          event_type?: string | null;
          guest_id?: string | null;
          id?: string;
          notes?: string | null;
          room_id?: string | null;
          status?: string | null;
        };
        Update: {
          banquet_package_id?: string | null;
          created_at?: string;
          event_date?: string | null;
          event_duration?: Json | null;
          event_type?: string | null;
          guest_id?: string | null;
          id?: string;
          notes?: string | null;
          room_id?: string | null;
          status?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "function_room_bookings_banquet_package_id_fkey";
            columns: ["banquet_package_id"];
            isOneToOne: false;
            referencedRelation: "banquet_packages";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "function_room_bookings_guest_id_fkey";
            columns: ["guest_id"];
            isOneToOne: false;
            referencedRelation: "guest";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "function_room_bookings_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "function-rooms";
            referencedColumns: ["id"];
          },
        ];
      };
      "function-rooms": {
        Row: {
          bookings: Json[] | null;
          created_at: string;
          description: string | null;
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
          bookings?: Json[] | null;
          created_at?: string;
          description?: string | null;
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
          bookings?: Json[] | null;
          created_at?: string;
          description?: string | null;
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
          image: string | null;
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
          image?: string | null;
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
          image?: string | null;
          nationality?: string | null;
          valid_id?: Json | null;
        };
        Relationships: [];
      };
      housekeeping: {
        Row: {
          created_at: string;
          guest_name: string | null;
          id: string;
          message: string | null;
          requests: string | null;
          room_number: number | null;
          scheduled_time: string | null;
          status: string | null;
          task_type: string | null;
        };
        Insert: {
          created_at?: string;
          guest_name?: string | null;
          id?: string;
          message?: string | null;
          requests?: string | null;
          room_number?: number | null;
          scheduled_time?: string | null;
          status?: string | null;
          task_type?: string | null;
        };
        Update: {
          created_at?: string;
          guest_name?: string | null;
          id?: string;
          message?: string | null;
          requests?: string | null;
          room_number?: number | null;
          scheduled_time?: string | null;
          status?: string | null;
          task_type?: string | null;
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
      room_types: {
        Row: {
          add_ons: Json[] | null;
          created_at: string;
          description: string | null;
          id: string;
          image: string | null;
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
          max_guest?: number | null;
          name?: string | null;
          peak_season_price?: number | null;
          price?: number | null;
          room_size?: string | null;
        };
        Relationships: [];
      };
      rooms: {
        Row: {
          area: string | null;
          bookings: Json[] | null;
          description: string | null;
          id: string;
          images: string[] | null;
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
          images?: string[] | null;
          remarks?: string | null;
          room_id: string;
          room_number: number;
          room_type_id?: string | null;
          status: string;
        };
        Update: {
          area?: string | null;
          bookings?: Json[] | null;
          description?: string | null;
          id?: string;
          images?: string[] | null;
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
      staff: {
        Row: {
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
          image: string | null;
          phone: string | null;
          position: string | null;
          role: string | null;
          shift_type: string | null;
          status: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          image?: string | null;
          phone?: string | null;
          position?: string | null;
          role?: string | null;
          shift_type?: string | null;
          status?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          image?: string | null;
          phone?: string | null;
          position?: string | null;
          role?: string | null;
          shift_type?: string | null;
          status?: string | null;
        };
        Relationships: [];
      };
      users: {
        Row: {
          created_at: string | null;
          email: string;
          full_name: string;
          id: string;
          image: string | null;
          phone: string | null;
          role: string;
          valid_id_image: string | null;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          full_name: string;
          id?: string;
          image?: string | null;
          phone?: string | null;
          role: string;
          valid_id_image?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          full_name?: string;
          id?: string;
          image?: string | null;
          phone?: string | null;
          role?: string;
          valid_id_image?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_full_analytics: { Args: never; Returns: Json };
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
