import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';

const VideoContext = createContext(null);

const generateId = () => Math.random().toString(36).substr(2, 9);

const initialState = {
  clips: [],
  audioTracks: [],
  textOverlays: [],
  aiFeatures: {
    subtitles: { enabled: false, data: [], processing: false },
    noiseRemoval: { enabled: false, intensity: 50, processing: false },
    autoCrop: { enabled: false, cropRegion: null, aspectRatio: '16:9', processing: false },
    colorCorrection: { enabled: false, brightness: 0, contrast: 0, saturation: 0, processing: false }
  },
  playheadPosition: 0,
  zoom: 1,
  totalDuration: 0,
  isProcessing: false,
  processingProgress: 0,
  error: null,
  currentPreviewUrl: null,
  history: { past: [], future: [] }
};

const computeDuration = (clips) => clips.reduce((acc, clip) => acc + (clip.endTime - clip.startTime), 0);

const pushHistory = (state) => {
  const { clips, audioTracks, textOverlays, aiFeatures, totalDuration } = state;
  return {
    ...state,
    history: {
      past: [...state.history.past, { clips, audioTracks, textOverlays, aiFeatures, totalDuration }],
      future: []
    }
  };
};

const videoReducer = (state, action) => {
  // Use Vite's import.meta.env.MODE instead of process.env.NODE_ENV
  if (import.meta.env.MODE === 'development') {
    console.log(`[VideoContext] Action: ${action.type}`, action.payload);
  }

  let newState;
  switch (action.type) {
    case 'SET_VIDEO': {
      const newClip = {
        id: generateId(),
        file: action.payload.file,
        metadata: action.payload.metadata,
        startTime: 0,
        endTime: action.payload.metadata.duration,
        duration: action.payload.metadata.duration,
        order: 0
      };
      newState = {
        ...state,
        clips: [newClip],
        totalDuration: action.payload.metadata.duration,
        currentPreviewUrl: URL.createObjectURL(action.payload.file),
        error: null
      };
      return pushHistory(newState);
    }
    
    case 'ADD_CLIP': {
      const { file, metadata } = action.payload;
      const newClip = {
        id: generateId(),
        file,
        metadata,
        startTime: 0,
        endTime: metadata.duration,
        duration: metadata.duration,
        order: state.clips.length
      };
      const updatedClips = [...state.clips, newClip];
      newState = { ...state, clips: updatedClips, totalDuration: computeDuration(updatedClips) };
      return pushHistory(newState);
    }

    case 'REORDER_CLIPS': {
      newState = { ...state, clips: action.payload };
      return pushHistory(newState);
    }

    case 'UPDATE_CLIP': {
      const updatedClips = state.clips.map(c => c.id === action.payload.id ? { ...c, ...action.payload.updates } : c);
      newState = { ...state, clips: updatedClips, totalDuration: computeDuration(updatedClips) };
      return pushHistory(newState);
    }

    case 'REMOVE_CLIP': {
      const updatedClips = state.clips.filter(c => c.id !== action.payload);
      newState = {
        ...state,
        clips: updatedClips,
        totalDuration: computeDuration(updatedClips),
        currentPreviewUrl: updatedClips.length > 0 ? URL.createObjectURL(updatedClips[0].file) : null
      };
      return pushHistory(newState);
    }

    case 'ADD_AUDIO': {
      newState = { ...state, audioTracks: [...state.audioTracks, { ...action.payload, id: generateId() }] };
      return pushHistory(newState);
    }

    case 'UPDATE_AUDIO': {
      newState = { ...state, audioTracks: state.audioTracks.map(a => a.id === action.payload.id ? { ...a, ...action.payload.updates } : a) };
      return pushHistory(newState);
    }

    case 'REMOVE_AUDIO': {
      newState = { ...state, audioTracks: state.audioTracks.filter(a => a.id !== action.payload) };
      return pushHistory(newState);
    }

    case 'ADD_TEXT': {
      newState = { ...state, textOverlays: [...state.textOverlays, { ...action.payload, id: generateId() }] };
      return pushHistory(newState);
    }

    case 'UPDATE_TEXT': {
      newState = { ...state, textOverlays: state.textOverlays.map(t => t.id === action.payload.id ? { ...t, ...action.payload.updates } : t) };
      return pushHistory(newState);
    }

    case 'REMOVE_TEXT': {
      newState = { ...state, textOverlays: state.textOverlays.filter(t => t.id !== action.payload) };
      return pushHistory(newState);
    }

    case 'UPDATE_AI_FEATURE': {
      const { feature, updates } = action.payload;
      newState = { ...state, aiFeatures: { ...state.aiFeatures, [feature]: { ...state.aiFeatures[feature], ...updates } } };
      if (updates.processing === undefined) {
         return pushHistory(newState);
      }
      return newState;
    }

    case 'SET_PLAYHEAD':
      return { ...state, playheadPosition: action.payload };

    case 'SET_ZOOM':
      return { ...state, zoom: action.payload };

    case 'SET_PROCESSING':
      return { ...state, isProcessing: action.payload.isProcessing, processingProgress: action.payload.progress || 0 };

    case 'UNDO': {
      if (state.history.past.length === 0) return state;
      const previous = state.history.past[state.history.past.length - 1];
      const newPast = state.history.past.slice(0, state.history.past.length - 1);
      return {
        ...state,
        clips: previous.clips,
        audioTracks: previous.audioTracks,
        textOverlays: previous.textOverlays,
        aiFeatures: previous.aiFeatures,
        totalDuration: previous.totalDuration,
        history: {
          past: newPast,
          future: [{ clips: state.clips, audioTracks: state.audioTracks, textOverlays: state.textOverlays, aiFeatures: state.aiFeatures, totalDuration: state.totalDuration }, ...state.history.future]
        }
      };
    }

    case 'REDO': {
      if (state.history.future.length === 0) return state;
      const next = state.history.future[0];
      const newFuture = state.history.future.slice(1);
      return {
        ...state,
        clips: next.clips,
        audioTracks: next.audioTracks,
        textOverlays: next.textOverlays,
        aiFeatures: next.aiFeatures,
        totalDuration: next.totalDuration,
        history: {
          past: [...state.history.past, { clips: state.clips, audioTracks: state.audioTracks, textOverlays: state.textOverlays, aiFeatures: state.aiFeatures, totalDuration: state.totalDuration }],
          future: newFuture
        }
      };
    }

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    default:
      return state;
  }
};

export const VideoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(videoReducer, initialState);

  useEffect(() => {
    if (import.meta.env.MODE === 'development') {
      console.log("[VideoContext] Initialized");
    }
  }, []);

  const setUploadedVideo = useCallback((file, metadata) => dispatch({ type: 'SET_VIDEO', payload: { file, metadata } }), []);
  const addClip = useCallback((file, metadata) => dispatch({ type: 'ADD_CLIP', payload: { file, metadata } }), []);
  const reorderClips = useCallback((clips) => dispatch({ type: 'REORDER_CLIPS', payload: clips }), []);
  const updateClip = useCallback((id, updates) => dispatch({ type: 'UPDATE_CLIP', payload: { id, updates } }), []);
  const removeClip = useCallback((id) => dispatch({ type: 'REMOVE_CLIP', payload: id }), []);
  const addAudioTrack = useCallback((audio) => dispatch({ type: 'ADD_AUDIO', payload: audio }), []);
  const updateAudioVolume = useCallback((id, volume) => dispatch({ type: 'UPDATE_AUDIO', payload: { id, updates: { volume } } }), []);
  const updateAudio = useCallback((id, updates) => dispatch({ type: 'UPDATE_AUDIO', payload: { id, updates } }), []);
  const removeAudioTrack = useCallback((id) => dispatch({ type: 'REMOVE_AUDIO', payload: id }), []);
  const addTextOverlay = useCallback((text) => dispatch({ type: 'ADD_TEXT', payload: text }), []);
  const updateTextProperties = useCallback((id, updates) => dispatch({ type: 'UPDATE_TEXT', payload: { id, updates } }), []);
  const removeTextOverlay = useCallback((id) => dispatch({ type: 'REMOVE_TEXT', payload: id }), []);
  const updateAIFeature = useCallback((feature, updates) => dispatch({ type: 'UPDATE_AI_FEATURE', payload: { feature, updates } }), []);
  const updatePlayheadPosition = useCallback((pos) => dispatch({ type: 'SET_PLAYHEAD', payload: pos }), []);
  const setZoom = useCallback((zoom) => dispatch({ type: 'SET_ZOOM', payload: zoom }), []);
  const setProcessingState = useCallback((isProcessing, progress = 0) => dispatch({ type: 'SET_PROCESSING', payload: { isProcessing, progress } }), []);
  const setError = useCallback((err) => dispatch({ type: 'SET_ERROR', payload: err }), []);
  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const redo = useCallback(() => dispatch({ type: 'REDO' }), []);

  const value = {
    ...state,
    setUploadedVideo,
    addClip,
    reorderClips,
    updateClip,
    removeClip,
    addAudioTrack,
    updateAudioVolume,
    updateAudio,
    removeAudioTrack,
    addTextOverlay,
    updateTextProperties,
    removeTextOverlay,
    updateAIFeature,
    updatePlayheadPosition,
    setZoom,
    setProcessingState,
    setError,
    undo,
    redo
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoContext = () => {
  const context = useContext(VideoContext);
  if (!context) throw new Error('useVideoContext must be used within a VideoProvider');
  return context;
};