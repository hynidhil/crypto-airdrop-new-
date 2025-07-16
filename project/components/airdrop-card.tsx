import React, { useState } from "react";

interface AirdropCardProps {
  airdrop: {
    id: string;
    title: string;
    description: string;
    link?: string;
    tags?: string[] | string;
    chain?: string;
    reward?: string;
    imageUrl?: string;
    image_url?: string; // Added for snake_case compatibility
  };
}

export const AirdropCard: React.FC<AirdropCardProps> = ({ airdrop }) => {

  // Normalize tags
  let tags: string[] = [];
  if (Array.isArray(airdrop.tags)) {
    tags = airdrop.tags;
  } else if (typeof airdrop.tags === 'string') {
    tags = airdrop.tags.split(',').map(t => t.trim());
  }

  // Support both imageUrl (camelCase) and image_url (snake_case)
  const image = airdrop.imageUrl || airdrop.image_url || '/placeholder.jpg';

  return (
    <>

      <div className="relative group max-w-md min-w-[320px] p-0 bg-white border rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 cursor-pointer hover:shadow-lg transition overflow-hidden">
        <img
          src={image}
          alt={airdrop.title}
          className="w-full h-56 object-cover rounded-lg transition-all duration-300 group-hover:opacity-60"
        />
        {/* Overlay on hover: show name, reward, button */}
        <div className="absolute inset-0 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60">
          <h5 className="mb-2 text-2xl font-bold text-white text-center drop-shadow">{airdrop.title}</h5>
          {airdrop.reward && (
            <div className="mb-3 text-lg text-white drop-shadow">Reward: {airdrop.reward}</div>
          )}
          <button
            className="px-5 py-2 text-base font-semibold text-white bg-blue-700 rounded hover:bg-blue-800 mt-2"
            tabIndex={-1}
          >
            View Details
          </button>
        </div>
      </div>
    </>
  );
};