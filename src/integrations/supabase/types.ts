export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      customers: {
        Row: {
          account_status: string | null
          address: string | null
          amount_paid: number | null
          application_no: string | null
          appointment_date: string | null
          appointment_paper_url: string | null
          appointment_type: string | null
          birth_certificate_url: string | null
          birth_date: string | null
          birth_place: string | null
          coming_platform: string | null
          court_document_url: string | null
          created_at: string
          created_by: string | null
          customer_code: string
          date_of_issue: string | null
          email: string | null
          full_name: string
          gender: string | null
          id: string
          immigration_place: string | null
          kebele_id_url: string | null
          marital_status: string | null
          membership_level: string | null
          month: string | null
          national_id_url: string | null
          passport_status: string | null
          passport_type: string | null
          passport_url: string | null
          phone_number: string | null
          photo_url: string | null
          police_report_url: string | null
          receipt_passport_number: string | null
          receipt_passport_number_url: string | null
          receipt_passport_picture_url: string | null
          receipt_url: string | null
          reference_number: number | null
          referral_details: string | null
          remarks: string | null
          served_by: string | null
          service_type: string | null
          smart_services_needed: boolean | null
          sub_service_type: string | null
          updated_at: string
          url: string | null
          week: string | null
          work_type: string | null
          year: number | null
        }
        Insert: {
          account_status?: string | null
          address?: string | null
          amount_paid?: number | null
          application_no?: string | null
          appointment_date?: string | null
          appointment_paper_url?: string | null
          appointment_type?: string | null
          birth_certificate_url?: string | null
          birth_date?: string | null
          birth_place?: string | null
          coming_platform?: string | null
          court_document_url?: string | null
          created_at?: string
          created_by?: string | null
          customer_code: string
          date_of_issue?: string | null
          email?: string | null
          full_name: string
          gender?: string | null
          id?: string
          immigration_place?: string | null
          kebele_id_url?: string | null
          marital_status?: string | null
          membership_level?: string | null
          month?: string | null
          national_id_url?: string | null
          passport_status?: string | null
          passport_type?: string | null
          passport_url?: string | null
          phone_number?: string | null
          photo_url?: string | null
          police_report_url?: string | null
          receipt_passport_number?: string | null
          receipt_passport_number_url?: string | null
          receipt_passport_picture_url?: string | null
          receipt_url?: string | null
          reference_number?: number | null
          referral_details?: string | null
          remarks?: string | null
          served_by?: string | null
          service_type?: string | null
          smart_services_needed?: boolean | null
          sub_service_type?: string | null
          updated_at?: string
          url?: string | null
          week?: string | null
          work_type?: string | null
          year?: number | null
        }
        Update: {
          account_status?: string | null
          address?: string | null
          amount_paid?: number | null
          application_no?: string | null
          appointment_date?: string | null
          appointment_paper_url?: string | null
          appointment_type?: string | null
          birth_certificate_url?: string | null
          birth_date?: string | null
          birth_place?: string | null
          coming_platform?: string | null
          court_document_url?: string | null
          created_at?: string
          created_by?: string | null
          customer_code?: string
          date_of_issue?: string | null
          email?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          immigration_place?: string | null
          kebele_id_url?: string | null
          marital_status?: string | null
          membership_level?: string | null
          month?: string | null
          national_id_url?: string | null
          passport_status?: string | null
          passport_type?: string | null
          passport_url?: string | null
          phone_number?: string | null
          photo_url?: string | null
          police_report_url?: string | null
          receipt_passport_number?: string | null
          receipt_passport_number_url?: string | null
          receipt_passport_picture_url?: string | null
          receipt_url?: string | null
          reference_number?: number | null
          referral_details?: string | null
          remarks?: string | null
          served_by?: string | null
          service_type?: string | null
          smart_services_needed?: boolean | null
          sub_service_type?: string | null
          updated_at?: string
          url?: string | null
          week?: string | null
          work_type?: string | null
          year?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
