// Renders a WhatsApp-ready comparison card (canvas, no deps) and shares it via
// the Web Share API; falls back to a wa.me text link where files aren't supported.
import type { EVModel } from '../types/ev';
import { formatINR } from './priceCalculator';
import { calculateTelanganaOnRoadPrice } from './priceCalculator';

const W = 1200;
const H = 630;

function drawCard(models: EVModel[], rtoCode: string): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#0071e3';
  ctx.fillRect(0, 0, W, 10);

  ctx.fillStyle = '#1d1d1f';
  ctx.font = '700 44px -apple-system, Segoe UI, Roboto, sans-serif';
  ctx.fillText('EV Compare Telangana', 60, 92);
  ctx.fillStyle = '#6e6e73';
  ctx.font = '400 24px -apple-system, Segoe UI, Roboto, sans-serif';
  ctx.fillText('On-road prices · G.O. Ms No. 41: ₹0 road tax', 60, 132);

  const colW = (W - 120) / Math.max(models.length, 1);
  models.forEach((m, i) => {
    const x = 60 + i * colW;
    const onRoad = calculateTelanganaOnRoadPrice(m, rtoCode).totalTelanganaOnRoadPrice;

    ctx.fillStyle = '#f5f5f7';
    ctx.beginPath();
    ctx.roundRect(x, 180, colW - 24, 330, 20);
    ctx.fill();

    ctx.fillStyle = '#6e6e73';
    ctx.font = '600 22px -apple-system, Segoe UI, Roboto, sans-serif';
    ctx.fillText(m.brand.slice(0, 18), x + 24, 236);

    ctx.fillStyle = '#1d1d1f';
    ctx.font = '700 28px -apple-system, Segoe UI, Roboto, sans-serif';
    ctx.fillText(m.name.split('(')[0].trim().slice(0, 16), x + 24, 278);

    ctx.font = '400 20px -apple-system, Segoe UI, Roboto, sans-serif';
    ctx.fillStyle = '#6e6e73';
    ctx.fillText(`${m.specs.realWorldCityRangeKm} km city range`, x + 24, 330);
    ctx.fillText(`${m.specs.batteryCapacityKwh} kWh · ${m.specs.topSpeedKmh} km/h`, x + 24, 362);

    ctx.fillStyle = '#0071e3';
    ctx.font = '800 32px -apple-system, Segoe UI, Roboto, sans-serif';
    ctx.fillText(formatINR(onRoad), x + 24, 452);

    ctx.fillStyle = '#008a4b';
    ctx.font = '600 18px -apple-system, Segoe UI, Roboto, sans-serif';
    ctx.fillText('₹0 road tax', x + 24, 486);
  });

  ctx.fillStyle = '#aeaeb2';
  ctx.font = '400 18px -apple-system, Segoe UI, Roboto, sans-serif';
  ctx.fillText('ev-compare-telangana.vercel.app', 60, H - 40);

  return canvas;
}

export async function shareComparison(
  models: EVModel[],
  rtoCode: string
): Promise<'shared' | 'downloaded' | 'cancelled'> {
  const canvas = drawCard(models, rtoCode);

  const text =
    `EV Compare TG — ${models.map(m => m.brand + ' ' + m.name.split('(')[0].trim()).join(' vs ')}\n` +
    models.map(m => `• ${m.name}: ${formatINR(calculateTelanganaOnRoadPrice(m, rtoCode).totalTelanganaOnRoadPrice)} on-road`).join('\n') +
    `\n₹0 road tax across Telangana → ${typeof window !== 'undefined' ? window.location.origin : 'https://ev-compare-telangana.vercel.app'}/#compare=${models.map(m => m.id).join(',')}`;

  const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));

  // Mobile: native share sheet with the image attached
  if (blob && navigator.canShare?.({ files: [new File([blob], 'compare.png', { type: 'image/png' })] })) {
    try {
      await navigator.share({
        files: [new File([blob], 'compare.png', { type: 'image/png' })],
        text
      });
      return 'shared';
    } catch (e) {
      if ((e as Error).name === 'AbortError') return 'cancelled';
    }
  }

  // Desktop fallback: download image + open WhatsApp text chat
  if (blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ev-compare-tg.png';
    a.click();
    URL.revokeObjectURL(url);
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  return 'downloaded';
}

export default shareComparison;
