import React from 'react'

export default function Navbar() {
  const menuItems = ['Home', 'Datasets', 'Documentation', 'About']

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="h-16 px-8 flex items-center justify-between">
        {/* Logo and Subtitle */}
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-primary-blue tracking-tight">
            GeoMNREGA Research Portal
          </h1>
          <p className="text-xs text-gray-600 font-medium">
            Indian Government Geo Data Infrastructure
          </p>
        </div>

        {/* Menu Items */}
        <div className="flex items-center gap-10">
          {menuItems.map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm font-medium text-primary-blue hover:text-blue-800 transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
