import { configureStore } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import { authApi, authReducer } from './features/auth';
import { usersApi } from './features/users';
import { uiReducer } from './features/ui';
import { paquetesApi, paquetesReducer } from './features/paquetes';
import { categoriasApi, categoriasReducer } from './features/categorias';
import { subcategoriasApi, subcategoriasReducer } from './features/subcategorias';
import { resenasApi, resenasReducer } from './features/resenas';
import { contactoApi, contactoReducer } from './features/contacto';

// Configuración de persistencia
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Solo persiste auth, no ui ni otros slices temporales
  version: 1, // Incrementar esto cuando cambies la estructura del store
  migrate: (state) => {
    // Migración para limpiar estado anterior
    if (state && state._persist && state._persist.version !== 1) {
      return Promise.resolve({
        auth: state.auth || {
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        },
        _persist: {
          version: 1,
          rehydrated: true,
        },
      });
    }
    return Promise.resolve(state);
  },
};

// Combinar reducers
const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  paquetes: paquetesReducer,
  categorias: categoriasReducer,
  subcategorias: subcategoriasReducer,
  resenas: resenasReducer,
  contacto: contactoReducer,
  [authApi.reducerPath]: authApi.reducer,
  [usersApi.reducerPath]: usersApi.reducer,
  [paquetesApi.reducerPath]: paquetesApi.reducer,
  [categoriasApi.reducerPath]: categoriasApi.reducer,
  [subcategoriasApi.reducerPath]: subcategoriasApi.reducer,
  [resenasApi.reducerPath]: resenasApi.reducer,
  [contactoApi.reducerPath]: contactoApi.reducer,
});

// Reducer persistido
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(authApi.middleware)
      .concat(usersApi.middleware)
      .concat(paquetesApi.middleware)
      .concat(categoriasApi.middleware)
      .concat(subcategoriasApi.middleware)
      .concat(resenasApi.middleware)
      .concat(contactoApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);
export default store;
