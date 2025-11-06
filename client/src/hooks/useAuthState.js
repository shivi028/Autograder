// import { useState, useEffect } from 'react'
// import { supabase } from '../lib/supabase'

// export function useAuthState() {
//   const [authState, setAuthState] = useState({
//     user: null,
//     session: null,
//     loading: true,
//     error: null
//   })

//   useEffect(() => {
//     let mounted = true

//     // Get initial session
//     const getInitialSession = async () => {
//       try {
//         const { data: { session }, error } = await supabase.auth.getSession()
        
//         if (error) {
//           console.error('Error getting session:', error)
//           if (mounted) {
//             setAuthState(prev => ({ ...prev, error: error.message, loading: false }))
//           }
//           return
//         }

//         if (mounted) {
//           setAuthState({
//             user: session?.user ?? null,
//             session,
//             loading: false,
//             error: null
//           })
//         }
//       } catch (error) {
//         console.error('Error in getInitialSession:', error)
//         if (mounted) {
//           setAuthState(prev => ({ ...prev, error: error.message, loading: false }))
//         }
//       }
//     }

//     getInitialSession()

//     // Listen for auth changes
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         console.log('Auth state changed:', event, session?.user?.id)
        
//         if (mounted) {
//           setAuthState({
//             user: session?.user ?? null,
//             session,
//             loading: false,
//             error: null
//           })
//         }
//       }
//     )

//     return () => {
//       mounted = false
//       subscription?.unsubscribe()
//     }
//   }, [])

//   return authState
// }

import { useState, useEffect } from 'react';

export const useAuthState = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  return { user, loading };
};