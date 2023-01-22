import classNames from 'classnames'
import React, { ButtonHTMLAttributes, DetailedHTMLProps, useMemo } from 'react'

type ButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

const Button = ({ className, disabled, ...buttonProps }: ButtonProps) => {
  const buttonClassName = useMemo(() => (
    classNames(
      'text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center ',
      className,
      { 
        'bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300': !disabled,
        'bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 cursor-not-allowed': disabled
      }
    )
  ), [className, disabled])
  
  return (
    <button {...buttonProps} className={buttonClassName} />
  )
}

export default Button