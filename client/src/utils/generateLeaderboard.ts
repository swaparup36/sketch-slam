import { allPlayersWithScoreInterface } from "../context/ContextProvider";

// Helper function to convert base64 to Blob
const dataURLtoBlob = (dataURL: string): Blob => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

export const generateLeaderboardImage = async (players: allPlayersWithScoreInterface[]): Promise<{ dataUrl: string; file: File }> => {
  // Create a canvas element
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) throw new Error('Could not get canvas context');
  
  // Set canvas dimensions
  canvas.width = 600;
  canvas.height = 400 + (players.length * 60);
  
  // Set background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#f3fae7');
  gradient.addColorStop(1, '#ffffff');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw header
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 36px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Game Results', canvas.width / 2, 60);
  
  // Draw decorative line
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 50, 80);
  ctx.lineTo(canvas.width / 2 + 50, 80);
  ctx.strokeStyle = '#d3e5b5';
  ctx.lineWidth = 4;
  ctx.stroke();
  
  // Draw players
  players.forEach((player, index) => {
    const y = 150 + (index * 60);
    
    // Draw player card background
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 2;
    ctx.beginPath();
    ctx.roundRect(50, y, canvas.width - 100, 45, 12);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    
    // Draw player avatar
    ctx.fillStyle = '#000000';
    ctx.font = '500 18px Inter, system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(player.user.avatar, 90, y + 28);
    
    // Draw player info
    ctx.fillStyle = '#000000';
    ctx.font = '500 18px Inter, system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(player.user.username, 120, y + 28);
    
    // Draw score
    ctx.font = '600 18px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(player.score ? Math.floor(player.score).toString() : '0', canvas.width - 70, y + 28);
    
    // Add trophy for winner
    if (index === 0) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = '20px Inter';
      ctx.textAlign = 'left';
      ctx.fillText('👑', 60, y + 28);
    }
  });
  
  // Add footer
  ctx.fillStyle = '#666666';
  ctx.font = '14px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Sketchslam Game Results', canvas.width / 2, canvas.height - 30);
  
  // Convert canvas to data URL
  const dataUrl = canvas.toDataURL('image/png');
  
  // Convert to Blob and then to File
  const blob = dataURLtoBlob(dataUrl);
  const file = new File([blob], 'leaderboard.png', { type: 'image/png' });
  
  return { dataUrl, file };
};