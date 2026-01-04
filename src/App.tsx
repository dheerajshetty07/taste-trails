import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Upload, Plus, ArrowLeft, ArrowRight, Star, Search, Filter, Download, RotateCcw, MapPin, ExternalLink, Menu, Calendar, X } from 'lucide-react';
import type { ReactNode, ChangeEvent } from 'react';
import { motion, AnimatePresence } from "framer-motion";

type Screen = 'log' | 'enrich' | 'places' | 'map' | 'wrapped' | 'settings';
type Price = '$' | '$$' | '$$$' | '$$$$';

interface Place {
  id: string;
  name: string;
  placeType?: string;
  cuisine?: string;
  topItem?: string;
  rating?: number | null;
  isFavorite: boolean;
  price?: Price | string;
  tags?: string[];
  notes?: string;
  city?: string;
  neighborhood?: string;
  dateVisited?: string;
  mapUrl?: string;
  websiteUrl?: string;
  menuUrl?: string;
  createdAt?: number;
  updatedAt?: number;
}

// Sample data with diverse entries
const SAMPLE_DATA: Place[] = [
  { id: '1', name: "Mama's Kitchen", placeType: "Restaurant", cuisine: "Italian", topItem: "Truffle Pasta", rating: 5, isFavorite: true, price: "$$$", tags: ["Date Night", "Cozy"], notes: "Amazing atmosphere", city: "San Francisco", neighborhood: "North Beach", dateVisited: "2025-01-15", mapUrl: "https://maps.google.com/?q=Mama's+Kitchen+SF", websiteUrl: "https://example.com", createdAt: Date.now(), updatedAt: Date.now() },
  { id: '2', name: "Blue Bottle Coffee", placeType: "Cafe / Bakery", cuisine: "American", topItem: "Cappuccino", rating: 4, isFavorite: false, price: "$$", tags: ["Quick Bite", "Solo Friendly"], notes: "", city: "Oakland", neighborhood: "Downtown", dateVisited: "2025-02-03", mapUrl: "https://maps.google.com/?q=Blue+Bottle+Oakland", createdAt: Date.now(), updatedAt: Date.now() },
  { id: '3', name: "The Cocktail Lab", placeType: "Bar / Cocktails", topItem: "Old Fashioned", rating: 5, isFavorite: true, price: "$$$", tags: ["Date Night", "Trendy", "Great Service"], notes: "Best cocktails in town", city: "San Francisco", neighborhood: "Mission", dateVisited: "2025-02-14", mapUrl: "https://maps.google.com/?q=Cocktail+Lab+SF", menuUrl: "https://example.com/menu", createdAt: Date.now(), updatedAt: Date.now() },
  { id: '4', name: "Sweet Dreams", placeType: "Dessert", topItem: "Chocolate Lava Cake", rating: 5, isFavorite: true, price: "$$", tags: ["Family-Friendly", "Good Ambience"], notes: "", city: "Berkeley", neighborhood: "Downtown", dateVisited: "2025-03-10", mapUrl: "https://maps.google.com/?q=Sweet+Dreams+Berkeley", createdAt: Date.now(), updatedAt: Date.now() },
  { id: '5', name: "Golden Gate Park Walk", placeType: "Activity / Sightseeing", topItem: "Japanese Tea Garden", rating: 5, isFavorite: true, tags: ["Outdoor Seating", "Great Views", "Solo Friendly"], notes: "Perfect morning walk", city: "San Francisco", neighborhood: "Golden Gate Park", dateVisited: "2025-03-22", mapUrl: "https://maps.google.com/?q=Golden+Gate+Park", createdAt: Date.now(), updatedAt: Date.now() },
  { id: '6', name: "Sushi Harbor", placeType: "Restaurant", cuisine: "Japanese", topItem: "Omakase", rating: 5, isFavorite: false, price: "$$$$", tags: ["Date Night", "Trendy"], notes: "Worth every penny", city: "San Francisco", neighborhood: "Japantown", dateVisited: "2025-04-05", mapUrl: "https://maps.google.com/?q=Sushi+Harbor+SF", createdAt: Date.now(), updatedAt: Date.now() },
  { id: '7', name: "Taco Express", placeType: "Restaurant", cuisine: "Mexican", topItem: "Fish Tacos", rating: 4, isFavorite: false, price: "$", tags: ["Quick Bite", "Casual", "Local Favorite"], notes: "", city: "Oakland", neighborhood: "Temescal", dateVisited: "2025-04-20", mapUrl: "https://maps.google.com/?q=Taco+Express+Oakland", createdAt: Date.now(), updatedAt: Date.now() },
  { id: '8', name: "Alcatraz Tour", placeType: "Activity / Sightseeing", topItem: "Audio Tour", rating: 4, isFavorite: false, tags: ["Tourist Spot", "Great Views"], notes: "Book in advance", city: "San Francisco", neighborhood: "Fisherman's Wharf", dateVisited: "2024-12-15", mapUrl: "https://maps.google.com/?q=Alcatraz+Island", createdAt: Date.now(), updatedAt: Date.now() },
  { id: '9', name: "Pho Garden", placeType: "Restaurant", cuisine: "Vietnamese", topItem: "Pho Tai", rating: 4, isFavorite: false, price: "$", tags: ["Quick Bite", "Casual", "Hidden Gem"], notes: "", city: "San Jose", neighborhood: "Little Saigon", dateVisited: "2025-05-12", mapUrl: "https://maps.google.com/?q=Pho+Garden+SJ", createdAt: Date.now(), updatedAt: Date.now() },
  { id: '10', name: "The Wine Room", placeType: "Bar / Cocktails", topItem: "Pinot Noir Flight", rating: 4, isFavorite: false, price: "$$$", tags: ["Date Night", "Cozy", "Happy Hour"], notes: "", city: "Napa", neighborhood: "Downtown", dateVisited: "2025-06-01", mapUrl: "https://maps.google.com/?q=Wine+Room+Napa", createdAt: Date.now(), updatedAt: Date.now() },
  { id: '11', name: "Curry Palace", placeType: "Restaurant", cuisine: "Indian", topItem: "Butter Chicken", rating: 5, isFavorite: true, price: "$$", tags: ["Family-Friendly", "Great Service"], notes: "Incredible flavors", city: "Fremont", neighborhood: "Little India", dateVisited: "2025-06-18", mapUrl: "https://maps.google.com/?q=Curry+Palace+Fremont", createdAt: Date.now(), updatedAt: Date.now() },
  { id: '12', name: "Artisan Bakery", placeType: "Cafe / Bakery", topItem: "Croissant", rating: 5, isFavorite: true, price: "$$", tags: ["Quick Bite", "Local Favorite", "Good Ambience"], notes: "", city: "Berkeley", neighborhood: "Gourmet Ghetto", dateVisited: "2025-07-04", mapUrl: "https://maps.google.com/?q=Artisan+Bakery+Berkeley", createdAt: Date.now(), updatedAt: Date.now() },
  { id: '13', name: "Muir Woods Hike", placeType: "Activity / Sightseeing", topItem: "Cathedral Grove", rating: 5, isFavorite: true, tags: ["Great Views", "Outdoor Seating"], notes: "Breathtaking redwoods", city: "Mill Valley", neighborhood: "Muir Woods", dateVisited: "2025-07-20", mapUrl: "https://maps.google.com/?q=Muir+Woods", createdAt: Date.now(), updatedAt: Date.now() },
  { id: '14', name: "Thai Basil", placeType: "Restaurant", cuisine: "Thai", topItem: "Pad Thai", rating: 4, isFavorite: false, price: "$$", tags: ["Casual", "Quick Bite"], notes: "", city: "San Francisco", neighborhood: "Sunset", dateVisited: "2025-08-15", mapUrl: "https://maps.google.com/?q=Thai+Basil+SF", createdAt: Date.now(), updatedAt: Date.now() },
  { id: '15', name: "Ice Cream Dreams", placeType: "Dessert", topItem: "Salted Caramel", rating: 4, isFavorite: false, price: "$", tags: ["Family-Friendly", "Quick Bite"], notes: "", city: "Palo Alto", neighborhood: "University Avenue", dateVisited: "2025-09-01", mapUrl: "https://maps.google.com/?q=Ice+Cream+Dreams+PA", createdAt: Date.now(), updatedAt: Date.now() }
];

const CUISINE_BAR_COLORS = [
  '#6B4A2D', // darkest
  '#8A6242',
  '#A97C57',
  '#C9A774',
  '#E0C9A6'  // lightest
];

const PLACE_TYPES = [
  "Restaurant",
  "Cafe / Bakery",
  "Dessert",
  "Bar / Cocktails",
  "Activity / Sightseeing",
  "Experience",
  "Stay",
  "Other"
];

const CUISINES = [
  "American", "Italian", "Chinese", "Japanese", "Korean", "Thai", "Vietnamese",
  "Indian", "French", "Greek", "Spanish", "Turkish", "Lebanese", "Ethiopian",
  "Peruvian", "Brazilian", "Caribbean", "Hawaiian", "Cuban", "Mexican","Mediterranean",
  "Middle Eastern", "Fusion", "Other", "Balkan","Taiwanese", "Filipino", "German",
].sort();

const TAGS = [
  "Date Night", "Family-Friendly", "Solo Friendly",
  "Quick Bite", "Late Night", "Happy Hour",
  "Great Service", "Good Ambience", "Cozy", "Trendy",
  "Outdoor Seating", "Great Views",
  "Hidden Gem", "Tourist Spot", "Local Favorite", "Casual", 
  "Fast Casual", "Fine Dining", "All You Can Eat", 
  "Authentic","Scenic", "Coktail Spot"
];

const CITY_OPTIONS = [
  "Arlington",
  "Alexandria",
  "Davis",
  "Falls Church",
  "McLean",
  "San Francisco",
  "Tysons",
  "Washington DC",
  "Other"
];

const PRICES = ["$", "$$", "$$$", "$$$$"];

// Utility to generate UUIDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Toast notification component

type ToastProps = { message: string; onClose: () => void };

const Toast = ({ message, onClose }: ToastProps) => {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-[#1C1C1C] text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
      <span>{message}</span>
      <button onClick={onClose} className="text-white/80 hover:text-white">
        <X size={16} />
      </button>
    </div>
  );
};

// Modal component

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#2e241b] rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-[#E0D7CF] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#ffffff]">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#E0D7CF]/50 rounded-lg">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

type PlacesTabProps = {
  filteredPlaces: Place[];
  places: Place[];

  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;

  filterType: string;
  setFilterType: React.Dispatch<React.SetStateAction<string>>;

  filterCuisine: string;
  setFilterCuisine: React.Dispatch<React.SetStateAction<string>>;

  filterRating: string;
  setFilterRating: React.Dispatch<React.SetStateAction<string>>;

  filterFavorites: boolean;
  setFilterFavorites: React.Dispatch<React.SetStateAction<boolean>>;

  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;

  deletePlace: (id: string) => void;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
};

const PlacesTab: React.FC<PlacesTabProps> = ({
  filteredPlaces,
  places,
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  filterCuisine,
  setFilterCuisine,
  filterRating,
  setFilterRating,
  filterFavorites,
  setFilterFavorites,
  sortBy,
  setSortBy,
  deletePlace,
  setCurrentIndex,
  setScreen,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // Keep your smoother typing approach
  const [localSearch, setLocalSearch] = useState(searchTerm);

  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    const t = setTimeout(() => setSearchTerm(localSearch), 150);
    return () => clearTimeout(t);
  }, [localSearch, setSearchTerm]);

  return (
    <div className="p-6 pb-24 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-[#3D2817] mb-6">Places</h1>

      <div className="bg-[#EFEBE7] rounded-2xl p-4 border-2 border-[#E0D7CF] mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9B8B7E]" size={20} />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search places..."
            className="w-full pl-10 pr-4 py-3 border-2 border-[#E0D7CF] rounded-xl focus:border-[#C9A774] focus:outline-none bg-[#FAF8F6] text-[#3D2817]"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-between p-3 bg-white border-2 border-[#E0D7CF] rounded-xl text-[#3D2817] font-medium hover:border-[#C9A774] transition-all"
        >
          <span className="flex items-center gap-2">
            <Filter size={18} />
            Filters & Sort
          </span>
          <span className="text-xs">{showFilters ? '▼' : '▶'}</span>
        </button>

        {showFilters && (
          <div className="space-y-3 pt-3 border-t border-[#E0D7CF]">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full p-3 border-2 border-[#E0D7CF] rounded-xl focus:border-[#C9A774] focus:outline-none bg-[#FAF8F6] text-[#3D2817]"
            >
              <option value="">All Place Types</option>
              {PLACE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            <select
              value={filterCuisine}
              onChange={(e) => setFilterCuisine(e.target.value)}
              className="w-full p-3 border-2 border-[#E0D7CF] rounded-xl focus:border-[#C9A774] focus:outline-none bg-[#FAF8F6] text-[#3D2817]"
            >
              <option value="">All Cuisines</option>
              {CUISINES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="w-full p-3 border-2 border-[#E0D7CF] rounded-xl focus:border-[#C9A774] focus:outline-none bg-[#FAF8F6] text-[#3D2817]"
            >
              <option value="">All Ratings</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
            </select>

            <button
              onClick={() => setFilterFavorites(!filterFavorites)}
              className={`w-full p-3 rounded-xl font-medium transition-all border-2 ${
                filterFavorites
                  ? 'bg-[#D4A574] text-white border-[#D4A574]'
                  : 'bg-white text-[#3D2817] border-[#E0D7CF] hover:border-[#C9A774]'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <Star size={18} className={filterFavorites ? 'fill-white' : ''} />
                Favorites Only
              </span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-3 border-2 border-[#E0D7CF] rounded-xl focus:border-[#C9A774] focus:outline-none bg-[#FAF8F6] text-[#3D2817]"
            >
              <option value="name">Sort by Name</option>
              <option value="rating">Sort by Rating</option>
              <option value="date">Sort by Date Visited</option>
              <option value="updated">Sort by Last Edited</option>
            </select>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {filteredPlaces.length === 0 ? (
          <div className="text-center py-12 text-[#6B5847]">
            <p>No places found</p>
          </div>
        ) : (
          filteredPlaces.map((place) => (
            <div
              key={place.id}
              onClick={() => setSelectedPlace(place)}
              className="bg-white rounded-2xl p-5 border-2 border-[#E0D7CF] cursor-pointer hover:border-[#C9A774] hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-[#3D2817]">{place.name}</h3>
                    {place.isFavorite && <Star size={18} className="fill-[#D4A574] text-[#D4A574]" />}
                  </div>

                  {(place.neighborhood || place.city) && (
                    <p className="text-sm text-[#6B5847] mb-2">
                      {[place.neighborhood, place.city].filter(Boolean).join(', ')}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="inline-block bg-white text-[#3D2817] text-xs px-3 py-1 rounded-full font-medium border border-[#E0D7CF]">
                      {place.placeType}
                    </span>
                    {place.cuisine && (
                      <span className="inline-block bg-white text-[#3D2817] text-xs px-3 py-1 rounded-full font-medium border border-[#E0D7CF]">
                        {place.cuisine}
                      </span>
                    )}
                    {place.price && (
                      <span className="inline-block bg-white text-[#3D2817] text-xs px-3 py-1 rounded-full font-medium border border-[#E0D7CF]">
                        {place.price}
                      </span>
                    )}
                  </div>

                  {place.topItem && <p className="text-sm text-[#6B5847] italic">"{place.topItem}"</p>}
                </div>

                {place.rating && (
                  <div className="flex items-center gap-1 ml-4">
                    <Star size={16} className="fill-[#D4A574] text-[#D4A574]" />
                    <span className="font-bold text-[#3D2817]">{place.rating}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={!!selectedPlace}
        onClose={() => setSelectedPlace(null)}
        title={selectedPlace?.name || ''}
      >
        {/* keep your existing modal body here exactly as you already have it */}
        {selectedPlace && (
          <div className="space-y-4">
            {/* ...UNCHANGED modal content... */}

            <div className="pt-4 space-y-2 border-t border-[#6B5847]">
              <button
                onClick={() => {
                  const index = places.findIndex(p => p.id === selectedPlace.id);
                  setCurrentIndex(index);
                  setSelectedPlace(null);
                  setScreen('enrich');
                }}
                className="w-full bg-[#C9A774] text-[#3D2817] py-4 rounded-xl font-bold hover:bg-[#D4A574] transition-all shadow-lg"
              >
                Edit Place
              </button>

              <button
                onClick={() => {
                  if (confirm('Delete this place?')) {
                    deletePlace(selectedPlace.id);
                    setSelectedPlace(null);
                  }
                }}
                className="w-full bg-[#A85846] text-white py-3 rounded-xl font-medium hover:opacity-90 transition-all"
              >
                Delete Place
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

const App = () => {
  const [screen, setScreen] = useState<Screen>('log');
  const [places, setPlaces] = useState<Place[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCuisine, setFilterCuisine] = useState('');
  const [filterRating, setFilterRating] = useState('');
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [pendingImport, setPendingImport] = useState<Place[] | null>(null);
  const [wrappedSlide, setWrappedSlide] = useState(0);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('taste-trails-data');
    if (saved) {
      try {
        setPlaces(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load data:', e);
      }
    } else {
      // Load sample data on first visit
      setPlaces(SAMPLE_DATA);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (places.length > 0) {
      localStorage.setItem('taste-trails-data', JSON.stringify(places));
    }
  }, [places]);

  const showToast = (message: string, duration = 1800) => {
  setToast(message);

  window.setTimeout(() => {
    setToast(null);
  }, duration);
};

const normalizePlaces = (input: unknown): Place[] => {
  if (!Array.isArray(input)) return [];
  return input
    .filter((x): x is Partial<Place> => typeof x === 'object' && x !== null)
    .map((x) => ({
      id: typeof x.id === 'string' ? x.id : generateId(),
      name: typeof x.name === 'string' ? x.name : 'Untitled',
      placeType: typeof x.placeType === 'string' ? x.placeType : undefined,
      cuisine: typeof x.cuisine === 'string' ? x.cuisine : undefined,
      topItem: typeof x.topItem === 'string' ? x.topItem : undefined,
      rating: typeof x.rating === 'number' ? x.rating : null,
      isFavorite: typeof x.isFavorite === 'boolean' ? x.isFavorite : false,
      price: typeof x.price === 'string' ? x.price : undefined,
      tags: Array.isArray(x.tags) ? x.tags.filter((t): t is string => typeof t === 'string') : [],
      notes: typeof x.notes === 'string' ? x.notes : '',
      city: typeof x.city === 'string' ? x.city : undefined,
      neighborhood: typeof x.neighborhood === 'string' ? x.neighborhood : undefined,
      dateVisited: typeof x.dateVisited === 'string' ? x.dateVisited : undefined,
      mapUrl: typeof x.mapUrl === 'string' ? x.mapUrl : undefined,
      websiteUrl: typeof x.websiteUrl === 'string' ? x.websiteUrl : undefined,
      menuUrl: typeof x.menuUrl === 'string' ? x.menuUrl : undefined,
      createdAt: typeof x.createdAt === 'number' ? x.createdAt : Date.now(),
      updatedAt: Date.now(),
    }));
};

  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event: ProgressEvent<FileReader>) => {
    try {
      const raw = event.target?.result;
      if (typeof raw !== 'string') throw new Error('Invalid file contents');
      const data: unknown = JSON.parse(raw);

      const imported = normalizePlaces(data);

if (imported.length === 0) {
  showToast('No valid places found in file');
  return;
}

if (places.length > 0) {
  setPendingImport(imported);
  setShowImportModal(true);
} else {
  setPlaces(imported);
  showToast('Imported successfully');
}

      // ✅ keep your existing normalization logic below this line
      // (we’ll type the normalization in the next step if needed)

    } catch (error) {
      showToast('Failed to parse JSON file');
    }
  };

  reader.readAsText(file);
  e.target.value = '';
};

  const handleImportDecision = (action: 'replace' | 'merge') => {
  if (!pendingImport) {
    setShowImportModal(false);
    return;
  }

  if (action === 'replace') {
    setPlaces(pendingImport);
    showToast('Data replaced successfully');
  } else {
    const existingIds = new Set(places.map((p) => p.id));
    const newPlaces = pendingImport.filter((p) => !existingIds.has(p.id));
    setPlaces([...places, ...newPlaces]);
    showToast(`Merged ${newPlaces.length} new places`);
  }

  setShowImportModal(false);
  setPendingImport(null);
};

  const handleExport = () => {
    const dataStr = JSON.stringify(places, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taste-trails-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Data exported successfully');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      setPlaces([]);
      localStorage.removeItem('taste-trails-data');
      showToast('All data reset');
      setScreen('log');
    }
  };

  const updatePlace = (index: number, updates: Partial<Place>) => {
  setPlaces((prev) => {
    const next = [...prev];
    const current = next[index];
    if (!current) return prev; // out of bounds safety
    next[index] = { ...current, ...updates, updatedAt: Date.now() };
    return next;
  });
};

const addPlace = (newPlace: Omit<Place, 'id' | 'isFavorite' | 'createdAt' | 'updatedAt'> & { name: string }) => {
  setPlaces((prev) => [
    ...prev,
    {
      ...newPlace,
      id: generateId(),
      isFavorite: false,
      tags: Array.isArray(newPlace.tags) ? newPlace.tags : [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ]);
  showToast('Place added successfully');
};

const deletePlace = (id: string) => {
  if (confirm('Delete this place?')) {
    setPlaces((prev) => prev.filter((p) => p.id !== id));
    showToast('Place deleted');
  }
};

  // Filtered and sorted places
  const filteredPlaces = useMemo(() => {
    let result = [...places];

    if (searchTerm) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.cuisine?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType) {
      result = result.filter(p => p.placeType === filterType);
    }

    if (filterCuisine) {
      result = result.filter(p => p.cuisine === filterCuisine);
    }

    if (filterRating) {
  const min = parseInt(filterRating, 10);
  result = result.filter((p) => (p.rating ?? 0) >= min);
}

    if (filterFavorites) {
      result = result.filter(p => p.isFavorite);
    }

    result.sort((a, b) => {
  if (sortBy === 'name') return a.name.localeCompare(b.name);

  if (sortBy === 'rating') return (b.rating ?? 0) - (a.rating ?? 0);

  if (sortBy === 'date') {
    const bTime = b.dateVisited ? new Date(b.dateVisited).getTime() : 0;
    const aTime = a.dateVisited ? new Date(a.dateVisited).getTime() : 0;
    return bTime - aTime;
  }

  if (sortBy === 'updated') return (b.updatedAt ?? 0) - (a.updatedAt ?? 0);

  return 0;
});

    return result;
  }, [places, searchTerm, filterType, filterCuisine, filterRating, filterFavorites, sortBy]);

  // Wrapped data 
  // Wrapped data (shows "2025 Wrapped" but does NOT require dates to populate)
// If at least one place can be identified as 2025, use only 2025.
// Otherwise (no dates), fall back to all places so you can test Wrapped.
const WRAPPED_YEAR = 2025;

const getPlaceYear = (p: Place): number | null => {
  // Prefer dateVisited if present, else createdAt/updatedAt
  if (p.dateVisited) {
    const t = new Date(p.dateVisited).getTime();
    if (!Number.isNaN(t)) return new Date(t).getFullYear();
  }
  const ts = p.createdAt ?? p.updatedAt;
  if (typeof ts === 'number') {
    const t = new Date(ts).getTime();
    if (!Number.isNaN(t)) return new Date(t).getFullYear();
  }
  return null;
};

const wrapped2025 = useMemo(() => {
  const validPlaces = places.filter((p) => p && (p.name ?? '').trim().length > 0);

  // Do we have ANY place that clearly belongs to 2025?
  const hasAny2025 = validPlaces.some((p) => getPlaceYear(p) === WRAPPED_YEAR);

  // If yes -> use only 2025 places. If not -> use ALL places (testing mode).
  const base = hasAny2025
    ? validPlaces.filter((p) => getPlaceYear(p) === WRAPPED_YEAR)
    : validPlaces;

  const foodPlaces = base.filter((p) =>
    ['Restaurant', 'Cafe / Bakery', 'Bar / Cocktails', 'Dessert'].includes(p.placeType ?? '')
  );

  const activities = base.filter((p) => p.placeType === 'Activity / Sightseeing');

  const cuisineCounts: Record<string, number> = {};
  base.forEach((p) => {
    if (p.cuisine && (p.placeType === 'Restaurant' || p.placeType === 'Cafe / Bakery')) {
      cuisineCounts[p.cuisine] = (cuisineCounts[p.cuisine] ?? 0) + 1;
    }
  });

  const topCuisines: Array<{ name: string; value: number }> = Object.entries(cuisineCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const favorites = base.filter((p) => p.isFavorite);

  const topRated = base
    .filter((p) => p.rating === 5)
    .slice(0, 5);

  const priceMap: Record<Price, number> = { '$': 1, '$$': 2, '$$$': 3, '$$$$': 4 };

  const bestValue = base
    .filter((p) => (p.rating ?? 0) > 0 && typeof p.price === 'string' && p.placeType !== 'Activity / Sightseeing')
    .map((p) => {
      const key = p.price as Price;
      const denom = priceMap[key];
      return { ...p, valueScore: denom ? (p.rating ?? 0) / denom : 0 };
    })
    .sort((a, b) => b.valueScore - a.valueScore)
    .slice(0, 3);

  const tagCounts: Record<string, number> = {};
  base.forEach((p) => {
    (p.tags ?? []).forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
    });
  });

  const topTags: Array<[string, number]> = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return {
    total: base.length,
    foodCount: foodPlaces.length,
    activityCount: activities.length,
    topCuisines,
    favorites,
    topRated,
    bestValue,
    topTags,
    usingYearFilter: hasAny2025, // optional: for debugging/UI if you want
  };
}, [places]);

  // LOG TAB
  const LogTab = () => {
    const incompletePlaces = places.filter(p => 
      !p.placeType || !p.rating || (p.placeType === 'Restaurant' && !p.cuisine)
    );

    return (
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-[#3D2817] mb-8">Taste Trails</h1>

        {places.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏷️</div>
            <h2 className="text-2xl font-semibold text-[#3D2817] mb-3">Start Your Trail</h2>
            <p className="text-[#6B5847] mb-8">Import your places or add them manually to begin.</p>

            <div className="space-y-3">
              <label className="block">
                <div className="bg-[#EFEBE7] border-2 border-dashed border-[#C9A774] rounded-2xl p-6 cursor-pointer hover:border-[#B8935E] transition-all">
                  <div className="flex items-center justify-center gap-3 text-[#3D2817]">
                    <Upload size={24} />
                    <span className="font-semibold">Import JSON</span>
                  </div>
                </div>
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>

              <button
                onClick={() => setShowAddModal(true)}
                className="w-full bg-[#3D2817] text-[#FAF8F6] rounded-2xl p-6 hover:opacity-90 transition-all flex items-center justify-center gap-3 font-semibold"
              >
                <Plus size={24} />
                <span>Add New Place</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {incompletePlaces.length > 0 && (
              <div className="bg-[#EFEBE7] rounded-2xl p-6 border border-[#E0D7CF]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-[#3D2817]">Your Progress</h3>
                  <span className="text-sm text-[#6B5847]">
                    {places.length - incompletePlaces.length} of {places.length} complete
                  </span>
                </div>
                <div className="bg-[#E0D7CF] h-2 rounded-full overflow-hidden mb-4">
                  <div 
                    className="bg-[#C9A774] h-full transition-all duration-300"
                    style={{ width: `${((places.length - incompletePlaces.length) / places.length) * 100}%` }}
                  />
                </div>
                <button
                  onClick={() => {
                    const firstIncomplete = places.findIndex(p => incompletePlaces.includes(p));
                    setCurrentIndex(firstIncomplete >= 0 ? firstIncomplete : 0);
                    setScreen('enrich');
                  }}
                  className="w-full bg-[#3D2817] text-[#FAF8F6] rounded-xl p-4 hover:opacity-90 transition-all font-medium"
                >
                  Continue Logging ({incompletePlaces.length} remaining)
                </button>
              </div>
            )}

            <button
              onClick={() => setShowAddModal(true)}
              className="w-full bg-[#EFEBE7] border-2 border-[#E0D7CF] text-[#3D2817] rounded-2xl p-6 hover:border-[#C9A774] transition-all flex items-center justify-center gap-3 font-semibold"
            >
              <Plus size={24} />
              <span>Add New Place</span>
            </button>

            <label className="block">
              <div className="bg-[#EFEBE7] border-2 border-[#E0D7CF] text-[#3D2817] rounded-2xl p-6 cursor-pointer hover:border-[#C9A774] transition-all flex items-center justify-center gap-3 font-semibold">
                <Upload size={24} />
                <span>Import More Places</span>
              </div>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>

            {places.length > 0 && incompletePlaces.length === 0 && (
              <div className="text-center py-8">
                <div className="text-5xl mb-3">✨</div>
                <p className="text-[#3D2817] font-medium">All places enriched!</p>
                <p className="text-[#6B5847] text-sm mt-1">Check out your Wrapped recap</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // ENRICH FLOW
  const EnrichFlow = () => {
    const place = places[currentIndex];
    const [form, setForm] = useState({
      placeType: place?.placeType || '',
      cuisine: place?.cuisine || '',
      topItem: place?.topItem || '',
      rating: place?.rating || null,
      price: place?.price || '',
      tags: place?.tags || [],
      notes: place?.notes || '',
      dateVisited: place?.dateVisited || '',
      websiteUrl: place?.websiteUrl || '',
      menuUrl: place?.menuUrl || '',
      city: place?.city || '',
      customCity: '',
      neighborhood: place?.neighborhood || '',
      isFavorite: place?.isFavorite ?? false,
    });

    useEffect(() => {
      if (place) {
        setForm({
          placeType: place.placeType || '',
          cuisine: place.cuisine || '',
          topItem: place.topItem || '',
          rating: place.rating || null,
          price: place.price || '',
          tags: place.tags || [],
          notes: place.notes || '',
          dateVisited: place.dateVisited || '',
          websiteUrl: place.websiteUrl || '',
          menuUrl: place.menuUrl || '',
          city: place.city || '',
          customCity: '',
          neighborhood: place.neighborhood || '',
          isFavorite: place?.isFavorite ?? false,
        });
      }
    }, [currentIndex, place]);

    if (!place) {
      return (
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-xl text-[#6B5847] mb-4">No places to enrich</p>
            <button
              onClick={() => setScreen('log')}
              className="bg-[#3D2817] text-[#FAF8F6] px-6 py-3 rounded-xl font-semibold"
            >
              Back to Log
            </button>
          </div>
        </div>
      );
    }

    const handleSave = () => {
      const finalCity =
  form.city === 'Other'
    ? (form.customCity || '').trim()
    : (form.city || '').trim();
    
    updatePlace(currentIndex, {
  ...form,
  city: finalCity,
  neighborhood: (form.neighborhood || '').trim()
});

      showToast('Saved ✓');
      if (currentIndex < places.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setScreen('log');
      }
    };

    const handleSkip = () => {
      if (currentIndex < places.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setScreen('log');
      }
    };

    const toggleTag = (tag: string) => {
  setForm((prev) => ({
    ...prev,
    tags: prev.tags.includes(tag)
      ? prev.tags.filter((t: string) => t !== tag)
      : [...prev.tags, tag],
  }));
};

    const showCuisine = ['Restaurant', 'Cafe / Bakery'].includes(form.placeType);
    const showPrice = form.placeType !== 'Activity / Sightseeing';
    const cuisineRequired = form.placeType === 'Restaurant';
    
    let topItemLabel = 'Top Item';
    if (form.placeType === 'Bar / Cocktails') topItemLabel = 'Best Drink';
    else if (form.placeType === 'Activity / Sightseeing') topItemLabel = 'Highlight';
    else topItemLabel = 'Best Dish';

    return (
  <div className="p-6 pb-60 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setScreen('log')}
            className="text-[#6B5847] hover:text-[#3D2817] font-medium"
          >
            ← Back to Log
          </button>
          <div className="text-sm font-medium text-[#6B5847]">
            {currentIndex + 1} / {places.length}
          </div>
        </div>

        <div className="bg-[#C9A774] h-1 rounded-full mb-6 overflow-hidden">
          <div
            className="bg-[#3D2817] h-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / places.length) * 100}%` }}
          />
        </div>

        <div className="bg-[#EFEBE7] rounded-3xl p-6 border border-[#E0D7CF] mb-6">
          <h2 className="text-2xl font-bold text-[#3D2817] mb-2">{place.name}</h2>
          {(place.neighborhood || place.city) && (<p className="text-[#6B5847] text-sm">
            {[place.neighborhood, place.city].filter(Boolean).join(', ')}
            </p>
          )}

        </div>

        {/* ✅ Location (City + Neighborhood) for Map tab */}
<div className="bg-white rounded-2xl p-5 border border-[#E0D7CF]">
  <label className="block text-sm font-semibold text-[#3D2817] mb-2">
    City
  </label>

  <select
    value={form.city}
    onChange={(e) => {
      const val = e.target.value;
      setForm(prev => ({
        ...prev,
        city: val,
        customCity: val === 'Other' ? prev.customCity : ''
      }));
    }}
    className="w-full p-3 border-2 border-[#E0D7CF] rounded-xl focus:border-[#C9A774] focus:outline-none bg-[#FAF8F6] text-[#3D2817]"
  >
    <option value="">Select city...</option>
    {CITY_OPTIONS.map(c => (
      <option key={c} value={c}>{c}</option>
    ))}
  </select>

  {form.city === 'Other' && (
    <input
      type="text"
      value={form.customCity}
      onChange={(e) => setForm(prev => ({ ...prev, customCity: e.target.value }))}
      placeholder="Type your city..."
      className="mt-3 w-full p-3 border-2 border-[#E0D7CF] rounded-xl focus:border-[#C9A774] focus:outline-none bg-[#FAF8F6] text-[#3D2817]"
    />
  )}
</div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-[#E0D7CF]">
            <label className="block text-sm font-semibold text-[#3D2817] mb-2">
              Place Type {form.placeType && <span className="text-[#6B8E5C]">✓</span>}
            </label>
            <select
              value={form.placeType}
              onChange={(e) => setForm({ ...form, placeType: e.target.value })}
              className="w-full p-3 border-2 border-[#E0D7CF] rounded-xl focus:border-[#C9A774] focus:outline-none bg-[#FAF8F6] text-[#3D2817]"
            >
              <option value="">Select type...</option>
              {PLACE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {showCuisine && (
            <div className="bg-white rounded-2xl p-5 border border-[#E0D7CF]">
              <label className="block text-sm font-semibold text-[#3D2817] mb-2">
                Cuisine {cuisineRequired && <span className="text-[#A85846]">*</span>} {form.cuisine && <span className="text-[#6B8E5C]">✓</span>}
              </label>
              <select
                value={form.cuisine}
                onChange={(e) => setForm({ ...form, cuisine: e.target.value })}
                className="w-full p-3 border-2 border-[#E0D7CF] rounded-xl focus:border-[#C9A774] focus:outline-none bg-[#FAF8F6] text-[#3D2817]"
              >
                <option value="">Select cuisine...</option>
                {CUISINES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}

<div className="bg-white rounded-2xl p-5 border border-[#E0D7CF]">
  <label className="block text-sm font-semibold text-[#3D2817] mb-2">
    Neighborhood
  </label>
  <input
    type="text"
    value={form.neighborhood}
    onChange={(e) => setForm(prev => ({ ...prev, neighborhood: e.target.value }))}
    placeholder="e.g., Rosslyn, Falls Church"
    className="w-full p-3 border-2 border-[#E0D7CF] rounded-xl focus:border-[#C9A774] focus:outline-none bg-[#FAF8F6] text-[#3D2817]"
  />
</div>

          <div className="bg-white rounded-2xl p-5 border border-[#E0D7CF]">
            <label className="block text-sm font-semibold text-[#3D2817] mb-2">
              {topItemLabel}
            </label>
            <input
              type="text"
              value={form.topItem}
              onChange={(e) => setForm({ ...form, topItem: e.target.value })}
              placeholder={`What was the ${topItemLabel.toLowerCase()}?`}
              className="w-full p-3 border-2 border-[#E0D7CF] rounded-xl focus:border-[#C9A774] focus:outline-none bg-[#FAF8F6] text-[#3D2817]"
            />
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#E0D7CF] shadow-sm">
            <label className="block text-sm font-semibold text-[#3D2817] mb-3">
  Rating {form.rating != null && (
    <span className="text-[#C9A774]">
      ✓ {form.rating} star{form.rating === 1 ? '' : 's'}
    </span>
  )}
</label>
            <div className="flex gap-3 justify-center">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setForm({ ...form, rating: star })}
                  className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                >
                  {(form.rating ?? 0) >= star ? (
                    <Star
                      size={44}
                      className="fill-[#D4A574] stroke-[#D4A574]"
                      strokeWidth={2.5}
                    />
                  ) : (
                    <Star
                      size={44}
                      className="fill-transparent stroke-[#E0D7CF] hover:stroke-[#C9A774]"
                      strokeWidth={2.5}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#E0D7CF]">
            <label className="block text-sm font-semibold text-[#3D2817] mb-3 flex items-center gap-2">
              <Star size={18} className="fill-[#D4A574] stroke-[#D4A574]" />
              Favorite {form.isFavorite && <span className="text-[#6B8E5C]">✓</span>}
            </label>
            <button
              type="button"
              onClick={() => setForm({ ...form, isFavorite: !form.isFavorite })}
              className={`w-full p-4 rounded-xl transition-all font-semibold text-base ${
                form.isFavorite
                  ? 'bg-[#D4A574] text-white shadow-lg'
                  : 'bg-white text-[#6B5847] border-2 border-[#E0D7CF] hover:border-[#C9A774] hover:bg-[#EFEBE7]'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <Star size={20} className={form.isFavorite ? 'fill-white stroke-white' : 'stroke-[#6B5847]'} strokeWidth={2} />
                {form.isFavorite ? 'Favorited' : 'Add to Favorites'}
              </span>
            </button>
          </div>

          {showPrice && (
            <div className="bg-white rounded-2xl p-5 border border-[#E0D7CF]">
              <label className="block text-sm font-semibold text-[#3D2817] mb-3">
                Price {form.price && <span className="text-[#6B8E5C]">✓ {form.price}</span>}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {PRICES.map(price => (
                  <button
                    key={price}
                    type="button"
                    onClick={() => setForm({ ...form, price })}
                    className={`py-3 rounded-xl font-bold transition-all text-lg ${
                      form.price === price
                        ? 'bg-[#3D2817] text-[#FAF8F6] shadow-lg transform scale-105'
                        : 'bg-white text-[#6B5847] border-2 border-[#E0D7CF] hover:border-[#C9A774] hover:bg-[#EFEBE7]'
                    }`}
                  >
                    {price}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl p-5 border border-[#E0D7CF]">
            <label className="block text-sm font-semibold text-[#3D2817] mb-3">
              Tags {form.tags.length > 0 && <span className="text-[#6B8E5C]">✓ {form.tags.length} selected</span>}
            </label>
            <div className="flex flex-wrap gap-2">
              {TAGS.map(tag => {
                const isSelected = form.tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#3D2817] text-[#FAF8F6] shadow-md transform scale-105'
                        : 'bg-white text-[#6B5847] border-2 border-[#E0D7CF] hover:border-[#C9A774] hover:bg-[#EFEBE7]'
                    }`}
                  >
                    {isSelected && '✓ '}{tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#E0D7CF]">
            <label className="block text-sm font-semibold text-[#3D2817] mb-2">
              Date Visited
            </label>
            <input
              type="date"
              value={form.dateVisited}
              onChange={(e) => setForm({ ...form, dateVisited: e.target.value })}
              className="w-full p-3 border-2 border-[#E0D7CF] rounded-xl focus:border-[#C9A774] focus:outline-none bg-[#FAF8F6] text-[#3D2817]"
            />
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#E0D7CF]">
            <label className="block text-sm font-semibold text-[#3D2817] mb-2">
              Website URL
            </label>
            <input
              type="url"
              value={form.websiteUrl}
              onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
              placeholder="https://example.com"
              className="w-full p-3 border-2 border-[#E0D7CF] rounded-xl focus:border-[#C9A774] focus:outline-none bg-[#FAF8F6] text-[#3D2817]"
            />
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#E0D7CF]">
            <label className="block text-sm font-semibold text-[#3D2817] mb-2">
              Menu
            </label>
            <input
              type="url"
              value={form.menuUrl}
              onChange={(e) => setForm({ ...form, menuUrl: e.target.value })}
              placeholder="https://example.com/menu"
              className="w-full p-3 border-2 border-[#E0D7CF] rounded-xl focus:border-[#C9A774] focus:outline-none bg-[#FAF8F6] text-[#3D2817]"
            />
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#E0D7CF]">
            <label className="block text-sm font-semibold text-[#3D2817] mb-2">
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any additional thoughts..."
              rows={3}
              className="w-full p-3 border-2 border-[#E0D7CF] rounded-xl focus:border-[#C9A774] focus:outline-none resize-none bg-[#FAF8F6] text-[#3D2817]"
            />
          </div>
        </div>

        <div className="fixed left-0 right-0 bg-[#FAF8F6] border-t border-[#E0D7CF] p-4 shadow-lg"
        style={{ bottom: 88 }} 
        >

          <div className="max-w-2xl mx-auto flex gap-3">
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="px-6 py-3 rounded-xl font-semibold bg-[#EFEBE7] text-[#3D2817] disabled:opacity-50 disabled:cursor-not-allowed border border-[#E0D7CF]"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={handleSkip}
              className="px-6 py-3 rounded-xl font-semibold bg-[#EFEBE7] text-[#3D2817] border border-[#E0D7CF]"
            >
              Skip
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-[#3D2817] text-[#FAF8F6] px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
            >
              <span>Save & Next</span>
              <ArrowRight size={20} />
            </button>
          </div>
          <p className="text-center text-xs text-[#9B8B7E] mt-2"></p>
        </div>
      </div>
    );
  };

  // MAP TAB (simplified list grouped by city)

  const [mapQuery, setMapQuery] = useState('');
  const [localMapQuery, setLocalMapQuery] = useState('');

  useEffect(() => {
  setLocalMapQuery(mapQuery);
}, [mapQuery]);

useEffect(() => {
  const t = window.setTimeout(() => setMapQuery(localMapQuery), 150);
  return () => window.clearTimeout(t);
}, [localMapQuery]);
  
  const MapTab = () => {
  const [mapQuery, setMapQuery] = useState('');
  const [localMapQuery, setLocalMapQuery] = useState('');

  useEffect(() => {
    setLocalMapQuery(mapQuery);
  }, [mapQuery]);

  useEffect(() => {
    const t = window.setTimeout(() => setMapQuery(localMapQuery), 150);
    return () => window.clearTimeout(t);
  }, [localMapQuery]);

  const citiesGroup = useMemo((): Array<[string, Place[]]> => {
    const q = mapQuery.trim().toLowerCase();

    const filtered = q
      ? places.filter((p) => {
          const haystack = [
            p.name,
            p.city,
            p.neighborhood,
            p.placeType,
            p.cuisine,
            ...(p.tags ?? []),
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

          return haystack.includes(q);
        })
      : places;

    const groups: Record<string, Place[]> = {};
    filtered.forEach((place) => {
      const city = place.city?.trim() ? place.city : 'Unknown';
      (groups[city] ??= []).push(place);
    });

    return (Object.entries(groups) as Array<[string, Place[]]>).sort((a, b) =>
      a[0].localeCompare(b[0])
    );
  }, [places, mapQuery]);

  return (
    <div className="p-6 pb-24 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-[#3D2817] mb-3">Map</h1>
      <p className="text-[#6B5847] mb-6 text-sm">
        Places grouped by city. Tap to open in Google Maps.
      </p>

      <div className="mb-6">
        <div className="flex items-center gap-2 bg-white border border-[#E0D7CF] rounded-2xl px-4 py-3">
          <Search size={18} className="text-[#9B8B7E]" />
          <input
            value={localMapQuery}
            onChange={(e) => setLocalMapQuery(e.target.value)}
            placeholder="Search by place, city, neighborhood, tag..."
            className="w-full outline-none text-[#3D2817] placeholder-[#9B8B7E]"
          />
          {localMapQuery && (
            <button
              onClick={() => setLocalMapQuery('')}
              className="text-[#9B8B7E] hover:text-[#3D2817] transition"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {localMapQuery && (
          <p className="text-xs text-[#9B8B7E] mt-2">
            Showing results for “{localMapQuery}”
          </p>
        )}
      </div>

      <div className="space-y-6">
        {citiesGroup.map(([city, cityPlaces]) => (
          <div key={city} className="bg-[#EFEBE7] rounded-2xl p-5 border border-[#E0D7CF]">
            <h2 className="text-xl font-bold text-[#3D2817] mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-[#C9A774]" />
              {city} ({cityPlaces.length})
            </h2>

            <div className="space-y-2">
              {cityPlaces.map((place) => (
                <div
                  key={place.id}
                  className="bg-white rounded-xl p-4 border border-[#E0D7CF] flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[#3D2817]">{place.name}</h3>
                      {place.isFavorite && (
                        <Star size={14} className="fill-[#D4A574] text-[#D4A574]" />
                      )}
                    </div>
                    <p className="text-sm text-[#6B5847]">{place.placeType}</p>
                    <p className="text-xs text-[#9B8B7E]">{place.neighborhood}</p>
                  </div>

                  {place.mapUrl && (
                    <a
                      href={place.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-3 bg-[#3D2817] text-[#FAF8F6] p-3 rounded-xl hover:opacity-90 transition-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {citiesGroup.length === 0 && (
          <div className="text-center py-12 text-[#6B5847]">
            <MapPin size={48} className="mx-auto mb-3 text-[#E0D7CF]" />
            <p>No places logged yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

  // WRAPPED TAB (Tinder-style swipe)
const WrappedTab = () => {
  const [direction, setDirection] = useState(0);

  // Card animation variants
  const cardVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 320 : -320,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 320 : -320,
      opacity: 0,
      scale: 0.98,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

    // Wrapped Story Copy
  const topCuisineNames = wrapped2025.topCuisines.map((c) => c.name);
  const topTags = wrapped2025.topTags.map(([tag]) => tag);

  const pick = (arr: string[], i: number) => (arr[i] ? arr[i] : null);

  const c1 = pick(topCuisineNames, 0);
  const c2 = pick(topCuisineNames, 1);
  const c3 = pick(topCuisineNames, 2);

  const t1 = pick(topTags, 0);
  const t2 = pick(topTags, 1);
  const t3 = pick(topTags, 2);

  const story = {
    hero: {
      headline: "Your 2025 Trail",
      sub: "Every place you went tells a story. Here’s what yours looked like.",
      metricLabel: "places explored",
    },
    balance: {
      headline: "You didn’t just go out, you explored.",
      micro: "A balance of comfort and curiosity.",
    },
    cuisines: {
      headline: "Your comfort flavors showed up strong.",
      sub: c1
        ? `You kept coming back to what you love, especially ${[c1, c2, c3].filter(Boolean).join(", ")}.`
        : "You kept coming back to what you love.",
      micro: "Familiar tastes, done really well.",
    },
    favorites: {
      headline: "These places stood out.",
      sub: `You marked ${wrapped2025.favorites.length} places as favorites, the ones you’d go back to without thinking twice.`,
      micro: "Quality mattered more than quantity.",
    },
    topRated: {
      headline: "You know what a 5-star experience feels like.",
      sub: "These places earned your top rating, not just good, but unforgettable.",
      micro: "No half-stars here.",
    },
    bestValue: {
      headline: "You found the sweet spot 😋",
      sub: "Great experiences don’t always have to be expensive. These places delivered the most value for their price.",
      micro: "Smart choices, well rewarded.",
    },
    vibes: {
      headline: "Your year had a vibe 😎",
      sub: t1
        ? `Your most common themes were ${[t1, t2, t3].filter(Boolean).join(", ")}.`
        : "Your most common themes showed up again and again.",
      micro: "That says more than you think.",
    },
    closing: {
      headline: "That was your trail 🐾",
      sub: "Every place added a little something to your year. Here’s to more great meals, moments, and memories in 2026.",
      cta: "Keep Exploring",
    },
  };
  // ------------------------------------------------------

  // Slides 
  const slides = [
    // Slide 0: Hero
    <div key="hero" className="bg-[#FAF8F6] rounded-3xl p-12 text-center min-h-[600px] flex flex-col items-center justify-center">
  <h1 className="text-5xl font-bold text-[#3D2817] mb-3">{story.hero.headline}</h1>
  <p className="text-lg text-[#6B5847] max-w-xl">{story.hero.sub}</p>

  <div className="text-8xl font-bold text-[#C9A774] my-8">{wrapped2025.total}</div>
  <p className="text-2xl text-[#6B5847]">{story.hero.metricLabel}</p>
</div>,

    // Slide 1: Balance
    <div key="balance" className="bg-[#FAF8F6] rounded-3xl p-12 min-h-[600px] flex flex-col items-center justify-center">
  <h2 className="text-3xl font-bold text-[#3D2817] mb-8">{story.balance.headline}</h2>
  <p className="text-sm text-[#9B8B7E] text-center mb-20">{story.balance.micro}</p>
  <div className="flex gap-8 mb-6">
        <div className="text-center">
          <div className="text-6xl mb-2">🍽️</div>
          <div className="text-5xl font-bold text-[#3D2817] mb-1">{wrapped2025.foodCount}</div>
          <p className="text-[#6B5847] font-medium">Bites & Sips</p>
        </div>
        <div className="text-center">
          <div className="text-6xl mb-2">🧭</div>
          <div className="text-5xl font-bold text-[#3D2817] mb-1">{wrapped2025.activityCount}</div>
          <p className="text-[#6B5847] font-medium">Experiences</p>
        </div>
      </div>
    </div>,

    // Slide 2: Top Cuisines
    wrapped2025.topCuisines.length > 0 && (
      <div key="cuisines" className="bg-[#FAF8F6] rounded-3xl p-12 min-h-[600px]">
        <h2 className="text-3xl font-bold text-[#3D2817] mb-8 text-center">{story.cuisines.headline}</h2>
<p className="text-center text-[#6B5847] mb-6 max-w-xl mx-auto">{story.cuisines.sub}</p>
<p className="text-center text-xs text-[#9B8B7E] mb-8">{story.cuisines.micro}</p>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={wrapped2025.topCuisines} layout="vertical">
            <XAxis
              type="number"
              allowDecimals={false}
              domain={[0, "dataMax"]}
              tickCount={Math.max(...wrapped2025.topCuisines.map((d) => d.value)) + 1}
              interval={0}
              stroke="#6B5847"
            />
            <YAxis type="category" dataKey="name" stroke="#6B5847" width={120} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#EFEBE7",
                border: "1px solid #E0D7CF",
                borderRadius: "12px",
                color: "#3D2817",
              }}
            />
            <Bar dataKey="value" radius={[0, 12, 12, 0]}>
              {wrapped2025.topCuisines.map((_, index) => (
                <Cell key={`cell-${index}`} fill={CUISINE_BAR_COLORS[index % CUISINE_BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    ),

    // Slide 3: Favorites
    wrapped2025.favorites.length > 0 && (
      <div key="favorites" className="bg-[#FAF8F6] rounded-3xl p-12 min-h-[600px]">
        <h2 className="text-3xl font-bold text-[#3D2817] mb-8 text-center flex items-center justify-center gap-2">
  <Star size={32} className="fill-[#D4A574] text-[#D4A574]" />
  {story.favorites.headline}
</h2>
<p className="text-center text-[#6B5847] mb-6 max-w-xl mx-auto">{story.favorites.sub}</p>
<p className="text-center text-xs text-[#9B8B7E] mb-8">{story.favorites.micro}</p>
        <div className="grid grid-cols-2 gap-4">
          {wrapped2025.favorites.slice(0, 6).map((place) => (
            <div key={place.id} className="bg-[#EFEBE7] rounded-2xl p-4 border border-[#E0D7CF]">
              <h3 className="font-bold text-[#3D2817] mb-1">{place.name}</h3>
              <p className="text-sm text-[#6B5847]">{place.placeType}</p>
              {place.rating && (
                <div className="flex items-center gap-1 mt-2">
                  <Star size={14} className="fill-[#D4A574] text-[#D4A574]" />
                  <span className="text-sm font-medium text-[#3D2817]">{place.rating}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    ),

    // Slide 4: Top Rated
    wrapped2025.topRated.length > 0 && (
      <div key="toprated" className="bg-[#FAF8F6] rounded-3xl p-12 min-h-[600px]">
        <h2 className="text-3xl font-bold text-[#3D2817] mb-8 text-center">{story.topRated.headline}</h2>
<p className="text-center text-[#6B5847] mb-6 max-w-xl mx-auto">{story.topRated.sub}</p>
<p className="text-center text-xs text-[#9B8B7E] mb-8">{story.topRated.micro}</p>
        <div className="space-y-4 max-w-md mx-auto">
          {wrapped2025.topRated.map((place) => (
            <div key={place.id} className="bg-[#EFEBE7] rounded-2xl p-5 border border-[#E0D7CF] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#3D2817] mb-1">{place.name}</h3>
                <p className="text-sm text-[#6B5847]">{place.cuisine || place.placeType}</p>
              </div>
              <div className="flex items-center gap-1">
                <Star size={20} className="fill-[#D4A574] text-[#D4A574]" />
                <span className="text-xl font-bold text-[#3D2817]">{place.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),

    // Slide 5: Best Value
    wrapped2025.bestValue.length > 0 && (
      <div key="bestvalue" className="bg-[#FAF8F6] rounded-3xl p-12 min-h-[600px]">
        <h2 className="text-3xl font-bold text-[#3D2817] mb-6 text-center">{story.bestValue.headline}</h2>
<p className="text-center text-[#6B5847] mb-8 max-w-xl mx-auto">{story.bestValue.sub}</p>
<p className="text-center text-xs text-[#9B8B7E] mb-8">{story.bestValue.micro}</p>
        <div className="space-y-4 max-w-md mx-auto">
          {wrapped2025.bestValue.map((place) => (
            <div key={place.id} className="bg-[#EFEBE7] rounded-2xl p-5 border border-[#E0D7CF]">
              <h3 className="font-bold text-[#3D2817] mb-2">{place.name}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star size={16} className="fill-[#D4A574] text-[#D4A574]" />
                    <span className="font-bold text-[#3D2817]">{place.rating}</span>
                  </div>
                  <span className="text-[#6B5847]">·</span>
                  <span className="font-medium text-[#3D2817]">{place.price}</span>
                </div>
                <span className="text-sm text-[#6B5847]">{place.cuisine}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),

    // Slide 6: Vibes
    wrapped2025.topTags.length > 0 && (
      <div key="vibes" className="bg-[#FAF8F6] rounded-3xl p-12 min-h-[600px] flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-[#3D2817] mb-8">{story.vibes.headline}</h2>
<p className="text-center text-[#6B5847] mb-6 max-w-xl">{story.vibes.sub}</p>
<p className="text-center text-xs text-[#9B8B7E] mb-8">{story.vibes.micro}</p>
        <div className="space-y-4 w-full max-w-md">
          {wrapped2025.topTags.map(([tag, count]) => (
            <div key={tag} className="flex items-center justify-between bg-[#EFEBE7] rounded-2xl p-4 border border-[#E0D7CF]">
              <span className="text-lg font-semibold text-[#3D2817]">{tag}</span>
              <span className="text-2xl font-bold text-[#C9A774]">{count}</span>
            </div>
          ))}
        </div>
      </div>
    ),

    // Slide 7: Closing
    <div key="closing" className="bg-[#FAF8F6] rounded-3xl p-12 text-center min-h-[600px] flex flex-col items-center justify-center">
      <h2 className="text-4xl font-bold text-[#3D2817] mb-8">{story.closing.headline}</h2>
<p className="text-xl text-[#6B5847] mb-8 max-w-xl">{story.closing.sub}</p>
<div className="text-6xl mb-8">✨</div>
<button
  onClick={() => setScreen('log')}
  className="bg-[#3D2817] text-[#FAF8F6] px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-all"
>
  {story.closing.cta}
</button>
    </div>,
  ].filter((s): s is React.ReactElement => Boolean(s));

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setWrappedSlide((prev) => {
      const next = prev + newDirection;
      if (next < 0) return 0;
      if (next > slides.length - 1) return slides.length - 1;
      return next;
    });
  };

  if (wrapped2025.total < 5) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">✨</div>
          <h2 className="text-2xl font-bold text-[#3D2817] mb-3">Your 2025 Trail Awaits</h2>
          <p className="text-[#6B5847] mb-2">Log at least 5 places from 2025 to unlock your wrapped recap.</p>
          <p className="text-sm text-[#9B8B7E] mb-6">Currently logged: {wrapped2025.total} of 5</p>
          <button
            onClick={() => setScreen("log")}
            className="bg-[#3D2817] text-[#FAF8F6] px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-all"
          >
            Start Logging
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#3D2817]">Your 2025 Trail</h1>
      </div>

      <div className="mb-6 flex items-center justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setWrappedSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === wrappedSlide ? "w-8 bg-[#3D2817]" : "w-2 bg-[#E0D7CF]"
            }`}
          />
        ))}
      </div>

      <div className="relative overflow-hidden" style={{ touchAction: "pan-y" }}>
        {wrappedSlide < slides.length - 1 && (
          <div className="absolute inset-0 translate-y-3 scale-[0.98] opacity-40 pointer-events-none">
            {slides[wrappedSlide + 1]}
          </div>
        )}

        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={wrappedSlide}
            custom={direction}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 320, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) paginate(1);
              else if (swipe > swipeConfidenceThreshold) paginate(-1);
            }}
            className="relative"
          >
            {slides[wrappedSlide]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex gap-3 justify-center">
        <button
          onClick={() => paginate(-1)}
          disabled={wrappedSlide === 0}
          className="px-6 py-3 rounded-xl font-semibold bg-[#EFEBE7] text-[#3D2817] disabled:opacity-50 disabled:cursor-not-allowed border border-[#E0D7CF]"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={() => paginate(1)}
          disabled={wrappedSlide === slides.length - 1}
          className="px-6 py-3 rounded-xl font-semibold bg-[#EFEBE7] text-[#3D2817] disabled:opacity-50 disabled:cursor-not-allowed border border-[#E0D7CF]"
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

  // SETTINGS TAB
  const SettingsTab = () => {
    return (
      <div className="p-6 pb-24 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-[#3D2817] mb-8">Settings</h1>

        <div className="space-y-4">
          <div className="bg-[#EFEBE7] rounded-2xl p-5 border border-[#E0D7CF]">
            <h2 className="font-semibold text-[#3D2817] mb-4">Data Management</h2>
            <div className="space-y-3">
              <button
                onClick={handleExport}
                className="w-full bg-white border-2 border-[#E0D7CF] text-[#3D2817] rounded-xl p-4 hover:border-[#C9A774] transition-all font-medium flex items-center justify-center gap-3"
              >
                <Download size={20} />
                Export JSON
              </button>

              <label className="block">
                <div className="w-full bg-white border-2 border-[#E0D7CF] text-[#3D2817] rounded-xl p-4 cursor-pointer hover:border-[#C9A774] transition-all font-medium flex items-center justify-center gap-3">
                  <Upload size={20} />
                  Import JSON
                </div>
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>

              <button
                onClick={handleReset}
                className="w-full bg-[#A85846] text-white rounded-xl p-4 hover:opacity-90 transition-all font-medium flex items-center justify-center gap-3"
              >
                <RotateCcw size={20} />
                Reset All Data
              </button>
            </div>
          </div>

          <div className="bg-[#EFEBE7] rounded-2xl p-5 border border-[#E0D7CF]">
            <h2 className="font-semibold text-[#3D2817] mb-2">About</h2>
            <p className="text-[#6B5847] text-sm mb-1">Taste Trails v1.0</p>
            <p className="text-[#9B8B7E] text-xs">Your personal places journal</p>
          </div>

          <div className="bg-[#EFEBE7] rounded-2xl p-5 border border-[#E0D7CF]">
            <h2 className="font-semibold text-[#3D2817] mb-3">Statistics</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6B5847]">Total places:</span>
                <span className="font-semibold text-[#3D2817]">{places.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B5847]">Favorites:</span>
                <span className="font-semibold text-[#3D2817]">{places.filter(p => p.isFavorite).length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ADD PLACE MODAL
  const AddPlaceModal = () => {
    const [newPlace, setNewPlace] = useState({
      name: '',
      placeType: '',
      cuisine: '',
      city: '',
      neighborhood: '',
      dateVisited: new Date().toISOString().split('T')[0],
      mapUrl: ''
    });

    const handleSubmit = () => {
  // If user leaves name empty, save with a friendly default
  const safePlace = {
    ...newPlace,
    name: (newPlace.name || '').trim() || 'Untitled place',
    placeType: (newPlace.placeType || '').trim(),
    city: (newPlace.city || '').trim(),
    neighborhood: (newPlace.neighborhood || '').trim(),
    cuisine: (newPlace.cuisine || '').trim(),
    mapUrl: (newPlace.mapUrl || '').trim(),
  };

  addPlace(safePlace);
  setShowAddModal(false);

  setNewPlace({
    name: '',
    placeType: '',
    cuisine: '',
    city: '',
    neighborhood: '',
    dateVisited: new Date().toISOString().split('T')[0],
    mapUrl: ''
  });
};

    return (
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Place">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#FAF8F6] mb-2">
              Name 
            </label>
            <input
              type="text"
              value={newPlace.name}
              onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
              placeholder="Place name"
              className="w-full p-3 border-2 border-[#6B5847] rounded-xl focus:border-[#C9A774] focus:outline-none bg-[#4A3420] text-[#FAF8F6] placeholder-[#9B8B7E]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#FAF8F6] mb-2">
              Place Type
            </label>
            <select
              value={newPlace.placeType}
              onChange={(e) => setNewPlace({ ...newPlace, placeType: e.target.value })}
              className="w-full p-3 border-2 border-[#6B5847] rounded-xl focus:border-[#C9A774] focus:outline-none bg-[#4A3420] text-[#FAF8F6]"
            >
              <option value="">Select type...</option>
              {PLACE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {['Restaurant', 'Cafe / Bakery'].includes(newPlace.placeType) && (
            <div>
              <label className="block text-sm font-semibold text-[#FAF8F6] mb-2">
                Cuisine {newPlace.placeType === 'Restaurant' && <span className="text-[#C9A774]">*</span>}
              </label>
              <select
                value={newPlace.cuisine}
                onChange={(e) => setNewPlace({ ...newPlace, cuisine: e.target.value })}
                className="w-full p-3 border-2 border-[#6B5847] rounded-xl focus:border-[#C9A774] focus:outline-none bg-[#4A3420] text-[#FAF8F6]"
              >
                <option value="">Select cuisine...</option>
                {CUISINES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-[#FAF8F6] mb-2">
              City
            </label>
            <input
              type="text"
              value={newPlace.city}
              onChange={(e) => setNewPlace({ ...newPlace, city: e.target.value })}
              placeholder="City"
              className="w-full p-3 border-2 border-[#6B5847] rounded-xl focus:border-[#C9A774] focus:outline-none bg-[#4A3420] text-[#FAF8F6] placeholder-[#9B8B7E]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#FAF8F6] mb-2">
              Neighborhood 
            </label>
            <input
              type="text"
              value={newPlace.neighborhood}
              onChange={(e) => setNewPlace({ ...newPlace, neighborhood: e.target.value })}
              placeholder="Neighborhood"
              className="w-full p-3 border-2 border-[#6B5847] rounded-xl focus:border-[#C9A774] focus:outline-none bg-[#4A3420] text-[#FAF8F6] placeholder-[#9B8B7E]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#FAF8F6] mb-2">
              Date Visited
            </label>
            <input
              type="date"
              value={newPlace.dateVisited}
              onChange={(e) => setNewPlace({ ...newPlace, dateVisited: e.target.value })}
              className="w-full p-3 border-2 border-[#6B5847] rounded-xl focus:border-[#C9A774] focus:outline-none bg-[#4A3420] text-[#FAF8F6]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#FAF8F6] mb-2">
              Google Maps URL (optional)
            </label>
            <input
              type="url"
              value={newPlace.mapUrl}
              onChange={(e) => setNewPlace({ ...newPlace, mapUrl: e.target.value })}
              placeholder="https://maps.google.com/..."
              className="w-full p-3 border-2 border-[#6B5847] rounded-xl focus:border-[#C9A774] focus:outline-none bg-[#4A3420] text-[#FAF8F6] placeholder-[#9B8B7E]"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-[#C9A774] text-[#3D2817] py-4 rounded-xl font-bold hover:bg-[#D4A574] transition-all shadow-lg text-lg"
          >
            Add Place
          </button>
        </div>
      </Modal>
    );
  };

  // IMPORT MODAL
  const ImportModal = () => (
    <Modal isOpen={showImportModal} onClose={() => setShowImportModal(false)} title="Import Data">
      <div className="space-y-4">
        <p className="text-[#FAF8F6] text-base">
          You already have {places.length} places logged. How would you like to import this data?
        </p>
        <button
          onClick={() => handleImportDecision('replace')}
          className="w-full bg-[#A85846] text-white py-4 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg text-lg"
        >
          Replace All Data
        </button>
        <button
          onClick={() => handleImportDecision('merge')}
          className="w-full bg-[#C9A774] text-[#3D2817] py-4 rounded-xl font-bold hover:bg-[#D4A574] transition-all shadow-lg text-lg"
        >
          Merge (Keep Existing + Add New)
        </button>
        <button
          onClick={() => setShowImportModal(false)}
          className="w-full bg-transparent text-[#FAF8F6] py-4 rounded-xl font-bold border-2 border-[#6B5847] hover:border-[#C9A774] transition-all"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );

  // BOTTOM NAV
  const BottomNav = () => {
    const tabs: Array<{ id: Screen; label: string; icon: any }> = [
  { id: 'log', label: 'Log', icon: Plus },
  { id: 'places', label: 'Places', icon: Calendar },
  { id: 'map', label: 'Map', icon: MapPin },
  { id: 'wrapped', label: 'Wrapped', icon: Star },
  { id: 'settings', label: 'Settings', icon: Menu },
];

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[#3D2817] via-[#4A3420] to-[#3D2817] border-t border-[#6B5847] px-4 py-3 shadow-2xl">
        <div className="max-w-2xl mx-auto flex justify-around">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = screen === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setScreen(tab.id)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#C9A774] text-[#3D2817] shadow-lg'
                    : 'text-[#FAF8F6] hover:text-[#C9A774] hover:bg-[#4A3420]'
                }`}
              >
                <Icon size={22} strokeWidth={2.5} />
                <span className="text-xs font-semibold">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF8F6] font-sans antialiased">
      {screen === 'log' && <LogTab />}
      {screen === 'enrich' && <EnrichFlow />}
      {screen === 'places' && (
  <PlacesTab
    filteredPlaces={filteredPlaces}
    places={places}
    searchTerm={searchTerm}
    setSearchTerm={setSearchTerm}
    filterType={filterType}
    setFilterType={setFilterType}
    filterCuisine={filterCuisine}
    setFilterCuisine={setFilterCuisine}
    filterRating={filterRating}
    setFilterRating={setFilterRating}
    filterFavorites={filterFavorites}
    setFilterFavorites={setFilterFavorites}
    sortBy={sortBy}
    setSortBy={setSortBy}
    deletePlace={deletePlace}
    setCurrentIndex={setCurrentIndex}
    setScreen={setScreen}
  />
)}
      {screen === 'map' && <MapTab />}
      {screen === 'wrapped' && <WrappedTab />}
      {screen === 'settings' && <SettingsTab />}

      <BottomNav />
      <AddPlaceModal />
      <ImportModal />

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
};

export default App;