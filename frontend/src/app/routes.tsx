import { createBrowserRouter } from 'react-router';

import { HomePage } from '@/features/home/HomePage';

import { Root } from './root';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      {
        path: 'explore',
        lazy: async () => {
          const { ExplorePage } = await import('@/features/explore/ExplorePage');
          return { Component: ExplorePage };
        },
      },
      {
        path: 'map',
        lazy: async () => {
          const { MapPage } = await import('@/features/map/MapPage');
          return { Component: MapPage };
        },
      },
      {
        path: 'mountain/:slug',
        lazy: async () => {
          const { MountainDetailPage } = await import('@/features/mountain/MountainDetailPage');
          return { Component: MountainDetailPage };
        },
      },
      {
        path: 'collections',
        lazy: async () => {
          const { CollectionsPage } = await import('@/features/collections/CollectionsPage');
          return { Component: CollectionsPage };
        },
      },
      {
        path: 'collections/:theme',
        lazy: async () => {
          const { CollectionDetailPage } = await import(
            '@/features/collections/CollectionDetailPage'
          );
          return { Component: CollectionDetailPage };
        },
      },
      {
        path: '__playground',
        lazy: async () => {
          const { PlaygroundPage } = await import('@/features/__playground/PlaygroundPage');
          return { Component: PlaygroundPage };
        },
      },
    ],
  },
]);
