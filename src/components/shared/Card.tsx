import React from 'react'

type CardProps = {
  children: React.ReactElement | React.ReactElement | string
  title: React.ReactElement | React.ReactElement | string
}

const Card = ({ children, title }: CardProps) => {
  return (
    <div className="block overflow-x-scroll max-w-full w-full p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
      {children}
    </div>
  )
}

export default Card
