export interface User {
    id: string
    name: string
    email: string
    role: 'super_admin' | 'manager' | 'finance_manager' | 'project_manager' | 'user'
    created_at?: string
    is_verified?: boolean
  }
  
  export interface Company {
    id: string
    name: string
    description?: string
    created_at: string
    project_count?: number
  }
  
  export interface Project {
    id: string
    name: string
    description?: string
    company_id: string
    company_name?: string
    project_manager_id?: string
    project_manager_name?: string
    project_value: number
    start_date: string
    end_date?: string
    status: 'active' | 'inactive' | 'completed'
    created_at: string
  }
  
  export interface Expense {
    id: string
    company_id: string
    company_name?: string
    project_id?: string
    project_name?: string
    vendor: string
    category: string
    subcategory?: string
    amount: number
    items?: ExpenseItem[]
    payment_method: string
    payment_due?: string
    notes?: string
    expense_date: string
    submitted_by: string
    submitted_by_name?: string
    submitted_at: string
    status: 'draft' | 'submitted' | 'approved' | 'rejected'
    payment_status?: 'pending' | 'paid'
    rejection_reason?: string
    created_at: string
  }
  
  export interface ExpenseItem {
    description: string
    quantity: number
    unit_price: number
    tax_rate: number
    total: number
  }
  
  export interface ProjectCategory {
    id: string
    name: string
    project_id: string
    subcategories?: ProjectSubcategory[]
    created_at: string
  }
  
  export interface ProjectSubcategory {
    id: string
    name: string
    category_id: string
  }
  
  export interface Task {
    id: string
    project_id: string
    project_name?: string
    title: string
    description?: string
    assigned_to?: string
    status: 'todo' | 'in_progress' | 'completed'
    priority: 'low' | 'medium' | 'high'
    start_date?: string
    due_date?: string
    created_at: string
  }