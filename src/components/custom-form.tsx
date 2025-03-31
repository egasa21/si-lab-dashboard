"use client"

import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface FormField {
  name: string
  label: string
  type: "text" | "email" | "password" | "number" | "select" | "checkbox"
  options?: { label: string; value: string }[] // Only for select fields
  placeholder?: string
  validation?: object // Validation rules for react-hook-form
}

interface CustomFormProps {
  fields: FormField[]
  onSubmit: (data: any) => void
  submitText?: string
}

export function CustomForm({ fields, onSubmit, submitText = "Submit" }: CustomFormProps) {
  const { register, handleSubmit, control, formState: { errors } } = useForm()

  const renderInput = (field: FormField) => {
    switch (field.type) {
      case "text":
      case "email":
      case "password":
      case "number":
        return (
          <Input 
            type={field.type} 
            placeholder={field.placeholder} 
            {...register(field.name, field.validation)} 
          />
        )

      case "select":
        return (
          <Controller
            name={field.name}
            control={control}
            rules={field.validation}
            render={({ field: { onChange, value } }) => (
              <Select onValueChange={onChange} value={value}>
                <SelectTrigger>
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )

      case "checkbox":
        return (
          <Controller
            name={field.name}
            control={control}
            rules={field.validation}
            render={({ field: { onChange, value } }) => (
              <div className="flex items-center space-x-2">
                <Checkbox checked={value} onCheckedChange={onChange} />
                <span>{field.label}</span>
              </div>
            )}
          />
        )

      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded-lg shadow-sm">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col">
          {field.type !== "checkbox" && <label className="mb-1 text-sm">{field.label}</label>}
          {renderInput(field)}
          {errors[field.name] && <span className="text-red-500 text-xs">This field is required</span>}
        </div>
      ))}

      <Button type="submit">{submitText}</Button>
    </form>
  )
}
