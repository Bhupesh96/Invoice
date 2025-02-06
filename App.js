import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoadingScreen from "./app/screens/LoadingScreen";
import HomeScreen from "./app/screens/HomeScreen";
import CreateInvoiceScreen from "./app/screens/CreateInvoiceScreen";
import InvoiceListScreen from "./app/screens/InvoiceListScreen";

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoadingScreen"
        screenOptions={{
          headerShown: false, // Hide header globally (optional)
        }}
      >
        <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="CreateInvoice" component={CreateInvoiceScreen} />
        <Stack.Screen name="InvoiceList" component={InvoiceListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
