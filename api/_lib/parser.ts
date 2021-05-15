import { IncomingMessage } from 'http';
import { parse } from 'url';
import { ParsedRequest, Theme } from './types';

export function parseRequest(req: IncomingMessage) {
  console.log('HTTP ' + req.url);
  const { pathname, query } = parse(req.url || '/', true);
  const {
    fontSize,
    images,
    widths,
    heights,
    theme,
    md,
    gradeColor,
    subTitle,
    pillText,
  } = query || {};

  if (Array.isArray(pillText)) {
    throw new Error('Expected a single pillText');
  }
  if (Array.isArray(fontSize)) {
    throw new Error('Expected a single fontSize');
  }
  if (Array.isArray(theme)) {
    throw new Error('Expected a single theme');
  }
  if (Array.isArray(gradeColor)) {
    throw new Error('Expected a single gradeColor');
  }
  if (Array.isArray(subTitle)) {
    throw new Error('Expected a single subTitle');
  }

  const arr = (pathname || '/').slice(1).split('.');
  let extension = '';
  let title = '';
  if (arr.length === 0) {
    title = '';
  } else if (arr.length === 1) {
    title = arr[0];
  } else {
    extension = arr.pop() as string;
    title = arr.join('.');
  }

  const parsedRequest: ParsedRequest = {
    fileType: extension === 'jpeg' ? extension : 'png',
    title: decodeURIComponent(title),
    subTitle: subTitle ? decodeURIComponent(subTitle) : '',
    pillText: pillText ? decodeURIComponent(pillText) : '',
    theme: theme === 'dark' ? 'dark' : 'light',
    md: md === '1' || md === 'true',
    fontSize: fontSize || '200px',
    images: getArray(images),
    widths: getArray(widths),
    heights: getArray(heights),
    gradeColor: gradeColor || 'black',
  };
  parsedRequest.images = getDefaultImages(
    parsedRequest.images,
    parsedRequest.theme
  );
  return parsedRequest;
}

function getArray(stringOrArray: string[] | string | undefined): string[] {
  if (typeof stringOrArray === 'undefined') {
    return [];
  } else if (Array.isArray(stringOrArray)) {
    return stringOrArray;
  } else {
    return [stringOrArray];
  }
}

function getDefaultImages(images: string[], theme: Theme): string[] {
  const defaultImage = theme === 'light' ? '' : '';

  if (!images || !images[0]) {
    return [defaultImage];
  }
  if (
    !images[0].startsWith('https://media.climbing.zone/') &&
    !images[0].startsWith('https://media.preview.climbing.zone/')
  ) {
    images[0] = defaultImage;
  }
  return images;
}
