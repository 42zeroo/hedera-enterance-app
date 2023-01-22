import React from 'react'
import Navbar from './Navbar'

export default function LayoutWrapper({ children }: { children: React.ReactElement }) {
  return (
    <div className='min-h-screen bg-gray-900 flex flex-col justify-start'>
      <div className='container mx-auto'>
        <Navbar/>
        
        <main className='px-4 mx-auto py-6 bg-gray-700 text-white min-h-full h-full'>
          {children}
        </main>
        
        <footer className="mx-auto p-4 bg-white rounded-lg justify-self-end shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© {new Date(Date.now()).getFullYear()} <span className="hover:underline">dApp GYM™</span>. All Rights Reserved.
            </span>
        </footer>
      </div>
    </div>
  )
}
