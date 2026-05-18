import bulletCam from '../../assets/bullet_camera.png';
import nvrRecorder from '../../assets/nvr_recorder.png';
import domeCam from '../../assets/dome_camera.png';
import powerSupply from '../../assets/power_supply.png';

export interface WarrantyInfo {
  icon: string;
  title: string;
  desc: string;
}

export interface Product {
  id: number;
  img: string;
  images?: string[];
  warranty?: WarrantyInfo[];
  name: string;
  price: string;
  sub: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  specs: Record<string, string>;
  features: string[];
  inStock?: boolean;
}

export const productsData: Product[] = [
  { 
    id: 1, 
    img: bulletCam, 
    images: [
      bulletCam,
      'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524055988636-4360fa403d02?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
    ],
    name: '4K Ultra HD Bullet Camera', 
    price: '₹12,499', 
    sub: 'High-definition outdoor surveillance with night vision', 
    category: 'Cameras',
    rating: 4.8,
    reviews: 142,
    description: 'Protect your property with our premium 4K Ultra HD Bullet Camera. Engineered for durability and high-performance monitoring, this camera delivers exceptionally crisp footage in all lighting conditions. Features weather-resistant sealing, smart motion alerts, and an industrial-grade sensor.',
    features: [
      'True 4K Ultra HD resolution (3840 x 2160 pixels)',
      'Advanced Night Vision with Smart-IR up to 40 meters',
      'IP67 Weather-proof rating for reliable outdoor operation',
      'AI-Powered human and vehicle detection to minimize false alarms',
      'Wide Dynamic Range (WDR) for balanced high-contrast scenes'
    ],
    specs: {
      'Sensor': '1/2.8" Progressive Scan CMOS',
      'Resolution': '8MP (3840 x 2160) at 20fps',
      'Lens': '4mm fixed lens, 85° horizontal FOV',
      'IR Distance': 'Smart-IR up to 40m (130ft)',
      'Min. Illumination': '0.005 Lux (F1.6, AGC ON), 0 Lux with IR',
      'Weather Protection': 'IP67 rated, weather-proof',
      'Power Source': 'PoE (Power over Ethernet 802.3af) or 12V DC',
      'Compression': 'H.265+ / H.265 / H.264+'
    }
  },
  { 
    id: 2, 
    img: nvrRecorder, 
    images: [
      nvrRecorder,
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1601524909162-be87252be298?w=600&auto=format&fit=crop&q=80'
    ],
    name: '16-Channel 4K NVR', 
    price: '₹42,500', 
    sub: 'Network Video Recorder with 4TB HDD pre-installed', 
    category: 'DVR & NVR',
    rating: 4.9,
    reviews: 88,
    description: 'Centralize your security operations with our professional-grade 16-Channel 4K NVR. Designed for heavy-duty video recording and continuous security monitoring, it supports simultaneous recording of up to 16 cameras at 4K resolution. Preloaded with a surveillance-class 4TB HDD for long video retention times.',
    features: [
      'Supports up to 16 IP cameras with high input bandwidth',
      'Pre-installed 4TB surveillance-grade hard disk drive (expandable to 16TB)',
      '16 PoE ports for simple plug-and-play installation',
      'Synchronous HDMI and VGA outputs for external display feeds',
      'Smart playback and search to locate target video highlights in seconds'
    ],
    specs: {
      'Video Input': '16-Channel IP video inputs',
      'Recording Resolution': 'Up to 12MP / 8MP (4K) / 5MP / 3MP / 1080p',
      'Decoding Format': 'H.265+ / H.265 / H.264+ / H.264',
      'Pre-installed HDD': '4TB Surveillance HDD (SATA interface)',
      'Storage Expandability': '2x SATA ports, up to 8TB capacity per HDD',
      'PoE Interfaces': '16 independent 100 Mbps PoE network interfaces',
      'USB Ports': '1x USB 2.0 (Front panel), 1x USB 3.0 (Rear panel)',
      'Power Supply': '100 to 240 VAC, 50 to 60 Hz'
    }
  },
  { 
    id: 3, 
    img: domeCam, 
    images: [
      domeCam,
      'https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80'
    ],
    name: 'Dome Security Camera', 
    price: '₹9,999', 
    sub: 'Vandal-proof indoor/outdoor camera with wide-angle lens', 
    category: 'Cameras',
    rating: 4.7,
    reviews: 195,
    description: 'Designed for elegant integration and high durability, our Vandal-Proof Dome Camera is perfect for monitoring hallways, checkout counters, lobbies, and outdoor entryways. Featuring an IK10-rated vandal-resistant housing and a wide-angle lens to eliminate monitoring blindspots.',
    features: [
      '5MP High-definition clarity for rich facial recognition detail',
      'IK10-rated vandal-proof housing protects against physical tampering',
      'Wide-angle 2.8mm lens for 105° expansive field of view',
      'Built-in microphone for high-quality audio recording',
      'Weather-resistant design suitable for indoor or outdoor setups'
    ],
    specs: {
      'Sensor': '1/3" Progressive Scan CMOS',
      'Resolution': '5MP (2560 x 1920) at 20fps',
      'Lens': '2.8mm fixed lens, 105° horizontal FOV',
      'Audio': 'Built-in microphone with environmental noise filters',
      'Vandal Resistance': 'IK10 impact-proof rated dome housing',
      'Night Vision': 'Exir Night Vision up to 30m (98ft)',
      'Weather Protection': 'IP67 rated, water-resistant',
      'Power Source': 'PoE (802.3af) or 12V DC'
    }
  },
  { 
    id: 4, 
    img: powerSupply, 
    images: [
      powerSupply,
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&auto=format&fit=crop&q=80'
    ],
    name: 'CCTV Power Supply Box', 
    price: '₹6,450', 
    sub: '18-Channel 12V DC distributed power box', 
    category: 'Power Supply',
    rating: 4.6,
    reviews: 62,
    description: 'Provide highly reliable, unified power to your entire CCTV camera network. This 18-channel centralized power supply box distributes 12V DC power to multiple cameras while protecting them from electrical surges, voltage drops, and short circuits. Ideal for neat, commercial installation cabling.',
    features: [
      '18 individual fuses for customized, independent channel protection',
      'Centralized 12V DC output, adjustable voltage to compensate for cable resistance',
      'Heavy-duty lockable metal enclosure with LED status indicator per channel',
      'Automated overload protection and thermal auto-reset mechanism',
      'Generous wiring room inside the cabinet for neat, professional installations'
    ],
    specs: {
      'Input Voltage': '110V AC or 220V AC (switch selectable)',
      'Output Voltage': '12V DC, adjustable (11V - 14.5V DC)',
      'Total Output Current': '20A continuous power rating',
      'Channels': '18 individually fused screw-terminal channels',
      'Fuse Type': 'PTC (resettable) fuse per channel, rated at 1.1A',
      'Enclosure': 'Heavy-gauge steel cabinet, lockable with key',
      'Safety Compliance': 'UL, CE, RoHS listed standards'
    }
  }
];
