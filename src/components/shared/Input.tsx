import React, { InputHTMLAttributes, useEffect } from 'react'
import { useField } from 'formik'

type InputProps = InputHTMLAttributes<HTMLInputElement>

type InputWithFieldProps = InputProps & {
  name: string,
  type: string
}

const Input =({ ...inputProps }: InputProps) => {
  return (
    <input {...inputProps} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'/>
  )
}

export const InputWithField = ({ name, ...inputProps }: InputWithFieldProps) => {
  const [field] = useField(name)

  useEffect(() => {
    console.log({field})
  }, [field])

  return (
    <Input {...inputProps} {...field}/>  
  )
}