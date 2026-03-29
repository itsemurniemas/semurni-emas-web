"use client";

import { useHomeViewModel } from "./useHomeViewModel";

export default function Home() {
  const { prices } = useHomeViewModel();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold text-slate-900">
          Welcome to <span className="text-blue-600">FE Landing</span>
        </h1>
        <p className="mt-3 text-2xl text-slate-600">
          Turborepo + Next.js + Tailwind
        </p>

        <div className="mt-6 p-4 w-96 bg-white rounded-xl border shadow-sm">
           <h3 className="text-xl font-bold mb-4">Live Gold Prices (from Core)</h3>
           <ul>
             {prices.map((p) => (
               <li key={p.karat} className="flex justify-between py-2 border-b last:border-0">
                 <span>{p.karat}</span>
                 <span className="font-mono font-bold">${p.pricePerGram}</span>
               </li>
             ))}
           </ul>
        </div>

        <div className="mt-6 flex gap-4">
          <div className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600 bg-white shadow-sm">
            <h3 className="text-2xl font-bold">Documentation &rarr;</h3>
            <p className="mt-4 text-xl">
              Find in-depth information about Next.js features and API.
            </p>
          </div>
          <div className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600 bg-white shadow-sm">
            <h3 className="text-2xl font-bold">Learn &rarr;</h3>
            <p className="mt-4 text-xl">
              Learn about Next.js in an interactive course with quizzes!
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
            <a 
              href="/pokemon"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold shadow-lg hover:bg-blue-700 transition"
            >
              View Pokémon List
            </a>
        </div>
      </main>
    </div>
  );
}
