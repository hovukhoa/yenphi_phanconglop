
import React, { useEffect, useState, useRef } from 'react';
import { SVG_ID_MAPPING } from '../constants';
import { Loader2, AlertCircle } from 'lucide-react';

interface ClassroomMapProps {
  onTaskClick: (taskName: string) => void;
}

export const ClassroomMap: React.FC<ClassroomMapProps> = ({ onTaskClick }) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSvg = async () => {
      try {
        // Tải file SVG từ thư mục public
        const response = await fetch('/map.svg');
        if (!response.ok) throw new Error(`Không thể tải bản đồ (Lỗi ${response.status})`);
        let text = await response.text();

        // Tự động tạo CSS để làm các ID trong bảng Mapping trở nên tương tác được
        // Chúng ta escape khoảng trắng trong ID để CSS hiểu (Ví dụ: #TRUC BANG -> #TRUC\ BANG)
        const cssSelectors = Object.keys(SVG_ID_MAPPING)
          .map(id => `#${id.replace(/ /g, "\\ ")}`)
          .join(', ');

        // Style injected vào SVG
        const styleTag = `
          <style>
            ${cssSelectors} {
              cursor: pointer !important;
              transition: all 0.2s ease;
              pointer-events: all !important;
            }
            ${cssSelectors}:hover {
              opacity: 0.7;
              filter: brightness(1.1);
              stroke: #2563eb; /* Màu primary blue */
              stroke-width: 2px;
            }
          </style>
        `;
        
        // Chèn style vào trước thẻ đóng </svg>
        text = text.replace('</svg>', `${styleTag}</svg>`);
        
        setSvgContent(text);
      } catch (err) {
        console.error("Error loading SVG:", err);
        setError('Không tìm thấy file map.svg trong thư mục public');
      } finally {
        setLoading(false);
      }
    };

    fetchSvg();
  }, []);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as Element;
    // Duyệt ngược lên từ element được click để tìm xem có trúng ID nào trong mapping không
    let current: Element | null = target;
    
    while (current && current !== mapContainerRef.current) {
        const id = current.id;
        if (id && SVG_ID_MAPPING[id]) {
            onTaskClick(SVG_ID_MAPPING[id]);
            return;
        }
        current = current.parentElement;
    }
  };

  if (loading) return (
    <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-2xl border border-gray-200">
        <Loader2 className="animate-spin mb-2 w-8 h-8 text-blue-500"/> 
        <span>Đang tải sơ đồ lớp học...</span>
    </div>
  );

  if (error) return (
    <div className="h-64 flex flex-col items-center justify-center text-red-500 bg-red-50 rounded-2xl border border-red-200 p-4 text-center">
        <AlertCircle className="mb-2 w-8 h-8"/> 
        <span className="font-medium">{error}</span>
        <span className="text-xs mt-1 text-gray-500">Vui lòng kiểm tra file /public/map.svg</span>
    </div>
  );

  return (
    <div 
      ref={mapContainerRef}
      className="w-full overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex justify-center"
      onClick={handleMapClick}
      dangerouslySetInnerHTML={{ __html: svgContent || '' }}
    />
  );
};
