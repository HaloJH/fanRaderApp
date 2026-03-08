import React from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen    from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import SignUpScreen    from '../screens/SignUpScreen';
import GroupsScreen    from '../screens/GroupsScreen';
import StyleScreen     from '../screens/StyleScreen';
import LocationScreen  from '../screens/LocationScreen';
import RadarScreen     from '../screens/RadarScreen';
import MatchScreen     from '../screens/MatchScreen';
import MatchedScreen   from '../screens/MatchedScreen';
import ChatScreen      from '../screens/ChatScreen';
import ProfileScreen   from '../screens/ProfileScreen';
import AlertsScreen    from '../screens/AlertsScreen';

export type RootStackParamList = {
  Splash:   undefined;
  Onboard:  undefined;
  SignUp:   undefined;
  Groups:   undefined;
  Style:    undefined;
  Location: undefined;
  Radar:    undefined;
  Match:    undefined;
  Matched:  undefined;
  Chat:     undefined;
  Profile:  undefined;
  Alerts:   undefined;
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer
      ref={navigationRef}
      documentTitle={{ formatter: () => 'Fan Radar' }}
    >
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: '#050510' },
        }}
      >
        <Stack.Screen name="Splash"    component={SplashScreen}    />
        <Stack.Screen name="Onboard"   component={OnboardingScreen}/>
        <Stack.Screen name="SignUp"    component={SignUpScreen}    />
        <Stack.Screen name="Groups"    component={GroupsScreen}    />
        <Stack.Screen name="Style"     component={StyleScreen}     />
        <Stack.Screen name="Location"  component={LocationScreen}  />
        <Stack.Screen name="Radar"     component={RadarScreen}     />
        <Stack.Screen name="Match"     component={MatchScreen}     />
        <Stack.Screen name="Matched"   component={MatchedScreen}   />
        <Stack.Screen name="Chat"      component={ChatScreen}      />
        <Stack.Screen name="Profile"   component={ProfileScreen}   />
        <Stack.Screen name="Alerts"    component={AlertsScreen}    />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
