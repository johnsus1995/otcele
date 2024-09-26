'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted)
    return (
      <Image
        src='data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjIwMHB4IiB3aWR0aD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIyIj48L3JlY3Q+PC9zdmc+Cg=='
        width={36}
        height={36}
        sizes='36x36'
        alt='Loading Light/Dark Toggle'
        priority={false}
        title='Loading Light/Dark Toggle'
      />
    );

  return (
    <div className='flex gap-1 items-center'>
      {/* <span>{resolvedTheme}</span> */}
      {resolvedTheme === 'light' ? (
        <FiMoon
          onClick={() => setTheme('dark')}
          className='cursor-pointer w-6 h-6'
        />
      ) : (
        <FiSun
          onClick={() => setTheme('light')}
          className='cursor-pointer w-6 h-6'
        />
      )}
    </div>
  );
}
