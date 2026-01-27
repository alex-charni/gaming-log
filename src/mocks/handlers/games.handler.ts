import { http, HttpResponse } from 'msw';
import { FEATURED_GAMES, GAMES } from '../data';
import { GameMock } from '../schemas';

type SortableField = 'date';
type SortDirection = 'asc' | 'desc';

const FINISHED_GAMES_URL = 'https://wrpriypmoaorobeeqmcc.supabase.co/rest/v1/items';
const FEATURED_GAMES_URL = 'https://wrpriypmoaorobeeqmcc.supabase.co/rest/v1/featured_games';

export const finishedGamesHandler = http.get(FINISHED_GAMES_URL, ({ request }) => {
  const url = new URL(request.url);
  let result = [...GAMES];

  const dateParams = url.searchParams.getAll('date');

  let dateGte: string | undefined;
  let dateLte: string | undefined;

  for (const param of dateParams) {
    const [op, value] = param.split('.', 2);

    if (op === 'gte') dateGte = value;
    if (op === 'lte') dateLte = value;
  }

  if (dateGte && dateLte) {
    const gteTimestamp = toTimestamp(dateGte);
    const lteTimestamp = toTimestamp(dateLte);

    result = result.filter((item) => {
      if (!item.date) return null;

      const itemTimestamp = toTimestamp(item.date);
      return lteTimestamp >= itemTimestamp && itemTimestamp >= gteTimestamp;
    });
  }

  const orderParam = url.searchParams.get('order');

  if (orderParam) {
    const [field, direction] = orderParam.split('.') as [SortableField, SortDirection];

    if (field && direction) {
      result = sortItems(result, direction, field);
    }
  }

  return HttpResponse.json(result);
});

export const featuredGamesHandler = http.get(FEATURED_GAMES_URL, ({ request }) => {
  const url = new URL(request.url);
  let result = [...FEATURED_GAMES];

  const orderParam = url.searchParams.get('order');

  if (orderParam) {
    const [field, direction] = orderParam.split('.') as [SortableField, SortDirection];

    if (field && direction) {
      result = sortItems(result, direction, field);
    }
  }

  return HttpResponse.json(result);
});

function sortItems(items: GameMock[], direction: SortDirection, field: SortableField): GameMock[] {
  return [...items].sort((a, b) => {
    let aValue: string;
    let bValue: string;

    switch (field) {
      case 'date':
        aValue = a.date as string;
        bValue = b.date as string;
        break;
    }

    return direction === 'desc' ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
  });
}

function toTimestamp(value: string): number {
  return new Date(value).getTime();
}
