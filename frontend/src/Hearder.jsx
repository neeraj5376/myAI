import React from 'react'
import ai from "./assets/ai.png";

const Hearder = () => {
  return (
    <header className="bg-zinc-900 fixed w-full h-25 border-b border-zinc-800 px-2 sm:px-6 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-center sm:justify-start gap-3">
          <img
            src={ai}
            alt="AI"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
          />

          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-white leading-tight">
            I am your <br />
            AI Assistant
          </h1>
          
        </div>
        
      </header>
  )
}

export default Hearder
