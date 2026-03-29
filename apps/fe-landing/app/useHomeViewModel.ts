import { useState, useEffect } from 'react';
import { GetGoldPrices, GoldPrice } from '@repo/core';

export const useHomeViewModel = () => {
  const [prices, setPrices] = useState<GoldPrice[]>([]);

  useEffect(() => {
    const fetchPrices = async () => {
      const useCase = new GetGoldPrices();
      const result = await useCase.execute();
      setPrices(result);
    };
    fetchPrices();
  }, []);

  return { prices };
};
