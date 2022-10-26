import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Dimensions, Text, View, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

//API에서 phone window size를 가지고 올 수 있겠지 !? << OS와 관련된 것이니까 API에서 찾아야함.
//Documentation에서도 API로 가서 찾으면 됨

const { height, width:SCREEN_WIDTH } = Dimensions.get("window");
//Api key같은 경우에는 원래 Server에 있어야 돼, 여기있으면 뽀록나
//어떻게 뽀록나는지도 확인해볼까?
const API_KEY='cac6f5d36b3b85104f18f4ba50f4725f';

const icons = {
  Clear: "ios-sunny-outline",
  Clouds: "md-cloudy-outline",
  Atmosphere:"",
  Snow: "",
  Rain: "",
  Drizzle: "",
  Thunderstorm: "",
}


export default function App() {
  const [ city, setCity ] = useState();
  const [ daysWeather, setDaysWeather ] = useState([]);
  const [ isLocationPermissionOk, setIsLocationPermissionOk] = useState();

  const getWeather = async() =>{
    //ask User Permission
    const { granted } = await Location.requestForegroundPermissionsAsync();
    
    if(!granted) {
      setIsLocationPermissionOk(false);
    }
    else{
      const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5})
      const geo = await Location.reverseGeocodeAsync({latitude, longitude});
      setCity(geo[0].city)
      console.log(latitude)
      console.log(longitude)

      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
      const json = await response.json();
      console.log(json.list[0].dt_txt)
      setDaysWeather(json.list);
    }
  }
  useEffect(()=>{
    getWeather();
  }, [])


  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.weather}>
                    {daysWeather.length === 0 ? 
                    <View style={styles.activityIndicator}>
                      <ActivityIndicator size='large' color='white' style={{marginTop: 50}}/>
                    </View> : daysWeather.map((list)=>(
                      <View style={styles.day}>
                        <View style={{flexDirection:'row', alignItems: 'center', width:'100%', justifyContent: 'space-between'}}>
                          <Text style={styles.temp}>{parseFloat(list.main.temp).toFixed(2) }</Text>
                          <Ionicons style={{marginRight: 30}} name={icons[list.weather[0].main]} size={50} color="white" />
                        </View>
                        <Text style={styles.weatherMain}>{list.weather[0].main}</Text>
                        <Text style={styles.description}>{list.weather[0].description}</Text>
                      </View>
                    ))}
        
      </ScrollView>
        <StatusBar style='dark'/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: 'tomato'
  },
  city:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cityName:{
    fontSize: 80,
    fontWeight: '500',
    color: 'white'
  },
  weather:{
  
  },
  day:{
    width: SCREEN_WIDTH,
    alignItems: 'flex-start',
    marginLeft: 10
  },
  temp:{
    marginTop: 50,
    fontSize: 108,
    color: 'white'
  },
  weatherMain:{
    marginTop: -10,
    marginLeft: 15,
    fontSize: 35,
    color: 'white'
  },
  description:{
    marginTop: -5,
    marginLeft: 15,
    fontSize: 25,
    color: 'white'
  },
  activityIndicator:{
    alignItems: 'center'
  }
});