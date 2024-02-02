import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, Pressable, Image, View, ScrollView, TextInput, StyleSheet, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import createClient, { urlFor } from '../sanity';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const Home = () => {
  const navigation = useNavigation();
  const [scheduledServices, setScheduledServices] = useState([]);
  const [valueAddedServices, setValueAddedServices] = useState([]);
  const [mechanicalRepairs, setMechanicalRepairs] = useState([]);
  const images = [
    'https://sparezone.net/wp-content/uploads/2023/12/WEBSITE-BANNER-1-scaled.jpg',
    'https://www.shutterstock.com/image-vector/tire-car-advertisement-poster-black-260nw-2028988058.jpg',
    'https://cdn3.vectorstock.com/i/1000x1000/00/82/realistic-tire-banner-car-wheel-repair-and-auto-vector-30320082.jpg'
  ]



  const [imgActive, setImageActive] = useState(0);
  onchange = (nativeEvent) => {
    if(nativeEvent){
      const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width)
      if (slide != imgActive){
        setImageActive(slide);
      }
    }
  }

  useEffect(() => {
    const groqQuery = `
      *[_type == 'services'] {
        serviceId,
        name,
        description,
        image,
        "servicesproducts": *[_type == 'servicesproducts' && references(^._id)] {
          _id,
          name,
          image,
          price,
          details,
          rating,
          reviews
        }
      }
    `;

    createClient.fetch(groqQuery)
      .then(data => {
        const scheduledServicesIds = ["S1", "S2", "S3", "S4"];
        const valueAddedServicesIds = ["S5", "S6", "S7", "S8"];
        const mechanicalRepairsIds = ["S9", "S10", "S11", "S12"];

        const filterByCategory = (ids) => data.filter(service => ids.includes(service.serviceId));
        const sortServices = (services) => services.sort((a, b) => a.serviceId.localeCompare(b.serviceId));

        setScheduledServices(sortServices(filterByCategory(scheduledServicesIds)));
        setValueAddedServices(sortServices(filterByCategory(valueAddedServicesIds)));
        setMechanicalRepairs(sortServices(filterByCategory(mechanicalRepairsIds)));
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const renderCategory = (service) => (
    <Pressable
      key={service.serviceId}
      style={{
        backgroundColor: "#bad6e3",
        paddingVertical: 8,
        borderRadius: 5,
        paddingHorizontal: 10,
        width:90,
        marginTop: 20,
        marginLeft: 3,
        marginRight: 3,
      }}
      onPress={() => {
        let categoryScreen;
        switch (service.serviceId) {
          case "S1":
            categoryScreen = "Periodic"; // Replace with the actual screen name for scheduled services
            break;
          case "S2":
            categoryScreen = "AC"; // Replace with the actual screen name for scheduled services
            break;
          case "S3":
            categoryScreen = "Wheel"; // Replace with the actual screen name for scheduled services
            break;
          case "S4":
            categoryScreen = "Batteries"; // Replace with the actual screen name for scheduled services
            break;
          case "S5":
          case "S6":
          case "S7":
          case "S8":
            categoryScreen = "ValueAdded"; // Replace with the actual screen name for value-added services
            break;
          case "S9":
          case "S10":
          case "S11":
          case "S12":
            categoryScreen = "Mechanical"; // Replace with the actual screen name for mechanical repairs
            break;
          default:
            categoryScreen = "Periodic"; // Default to "Periodic" screen
            break;
        }
        navigation.navigate(categoryScreen, { service });
      }}
    >
      <Image source={{ uri: urlFor(service.image).url() }} style={{marginLeft:'15%', width:50 , height: 50 }} />
      <Text style={{ color: "black", fontWeight: 700, fontSize: 12, marginLeft: 5, marginTop: 8 }}>{service.name}</Text>
    </Pressable>
  );
  

  const renderCategoryRow = (categories) => (
    <ScrollView horizontal={true}>
      {categories.map((category, index) => (
        <React.Fragment key={index}>{category}</React.Fragment>
      ))}
    </ScrollView>
  );


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", marginBottom:72 }}>
      <ScrollView>
        <View style={{ paddingTop: 60, paddingLeft: 25 }}>
          <Text style={{ color: "black", fontSize: 20 }}>What are you looking for?</Text>
        </View>
        <View style={{
          padding: 10,
          marginLeft: 18,
          marginTop: 18,
          flexDirection: "row",
          width: 350,
          backgroundColor: "#bad6e3",
          borderRadius: 20,
          alignItems: "center"
        }}>
          <Pressable><FontAwesome name="search" size={24} color="black" /></Pressable>
          <TextInput style={{ fontSize: 19, paddingLeft: 10, width: '80%' }} placeholder='Search' />
        </View>
        <View style={styles.container}>
        <View style={styles.wrap}>
          <ScrollView
          onScroll={({nativeEvent}) => onchange(nativeEvent)}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          horizontal
          style={styles.wrap}
          >
            {
              images.map((e, index) => 
              <Image
                key={e}
                resizeMode='stretch'
                style={styles.wrap}
                source={{uri: e}}
              />
              )
            }

          </ScrollView>
          <View style={styles.wrapDot}>
              {
                images.map((e, index) => 
                <Text
                key={e}
                style={imgActive == index ? styles.dotActive : styles.dot}
                >
                  &bull;
                </Text>
                
                )
              }
          </View>
        </View>
        </View>

        <View style={{ marginLeft: 10, marginTop: 20 }}>
          <Text style={{ color: "black", fontSize: 18, fontWeight: '800' }}>Scheduled Services</Text>
        </View>

        <View style={{ flexDirection: "row", margin: 2 }}>
          {renderCategoryRow(scheduledServices.map(renderCategory))}
        </View>

        <View style={{ marginLeft: 10, marginTop: 20 }}>
          <Text style={{ color: "black", fontSize: 18, fontWeight: '800' }}>Value Added Services</Text>
        </View>

        <View style={{ flexDirection: "row", margin: 2 }}>
          {renderCategoryRow(valueAddedServices.map(renderCategory))}
        </View>

        <View style={{ marginLeft: 10, marginTop: 20 }}>
          <Text style={{ color: "black", fontSize: 18, fontWeight: '800' }}>Mechanical Repairs</Text>
        </View>

        <View style={{ flexDirection: "row", margin: 2 }}>
          {renderCategoryRow(mechanicalRepairs.map(renderCategory))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
  
}

const styles = StyleSheet.create({
    container:{
      marginTop:8,
      flex:1
    },
    wrap:{
      width: WIDTH,
      height: HEIGHT * 0.25
    },
    wrapDot: {
      position: 'absolute',
      bottom: -15,
      flexDirection:'row',
      alignSelf:'center'
    },
    dotActive:{
      fontSize:54,
      margin:0.2,
      color:'black'
    },
    dot:{
      fontSize:54,
      margin:0.2,
      color:'white'
    }

});

export default Home;
