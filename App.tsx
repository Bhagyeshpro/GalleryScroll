import { StyleSheet, Text, View, ActivityIndicator, FlatList, Image, StatusBar, useWindowDimensions, Dimensions, ScrollView } from 'react-native';
import React, { useCallback, useEffect, useState, } from 'react'
import axios from 'axios';


const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([])
  const { height, width } = useWindowDimensions();
  const [pStars, setPStars] = useState([])


  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      img: "https://images.unsplash.com/photo-1551582045-6ec9c11d8697?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=465&q=80",
      title: 'First Item',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      img: "data:image/jpeg;base64,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",
      title: 'Second Item',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      img: "data:image/jpeg;base64,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",
      title: 'Third Item',
    },
  ];




  // console.log(pStars)


  useEffect(() => {
    loadWallpapers();
    // getPStars();

    StatusBar.setHidden(true)
  }, [])


  // const options = {
  //   method: 'GET',
  //   url: 'https://porn-gallery.p.rapidapi.com/pornos/Natasha%20Nice',
  //   headers: {
  //     'X-RapidAPI-Key': 'e71910d9f8msh2f78e8e7a196af1p1ec901jsna2c24f352ab5',
  //     'X-RapidAPI-Host': 'porn-gallery.p.rapidapi.com'
  //   }
  // };

  const options = {
    method: 'GET',
    url: 'https://porn-gallery.p.rapidapi.com/pornos/Natasha%20Nice',
    headers: {
      'X-RapidAPI-Key': 'e71910d9f8msh2f78e8e7a196af1p1ec901jsna2c24f352ab5',
      'X-RapidAPI-Host': 'porn-gallery.p.rapidapi.com'
    }
  };

  const getPStars = () => {
    axios.request(options).then(function (response) {
      setPStars(response.data)
    }).catch(function (error) {
      console.error(error);
    });
  }

  // console.log(pStars);


  const loadWallpapers = () => {
    axios.get('https://api.unsplash.com/photos/random?count=30&client_id=TRfCODKJ1Eg8iZyMMvlEPq7SZ2Eg5VtlKjDM3OGKEzQ')
      .then((response) => { setImages(response.data), setIsLoading(false) })
      .catch((error) => console.log(error))
      .finally(() => console.log("Request Completed!"))
  }

  // console.log("HI")

  // const renderImage = useCallback(({ item }) => 
  //     <Image
  //       style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height, flex: 1 }}
  //       source={{
  //         uri: item.img,
  //       }}
  //     ></Image>
  // )



  return (
    <View style={[styles.container, { width: width, height: height }]}>

      {/*<Image
        style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height, flex: 1 }}
        source={{
          uri: DATA[0].img,
        }}
      />  */}
      {/* <ScrollView pagingEnabled horizontal showsHorizontalScrollIndicator={false}>
        {images.map((item) => {
          return (
            <View>
              <Image
                style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height, flex: 1 }}
                source={{
                  uri: item.urls.regular,
                }}
              />
            </View>
          )
        })}
      </ScrollView> */}

      {/* <FlatList
        data={DATA}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) =>
        (
          <View>
            <Image
              style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height, flex: 1 }}
              source={{
                uri: item.img,
              }}
            />
          </View>
        )}
      /> */}

      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) =>
        (
          <View>
            <Image
              style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height, flex: 1 }}
              source={{
                uri: item.urls.regular,
              }}
              />
          </View>
        )}
      />

      {/* <Image
        style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height, flex: 1 }}
        source={{
          uri: pImage,
        }}
      /> */}

      {/* <FlatList
        data={DATA}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) =>
        (
          <View>
            <Image
              style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height, flex: 1 }}
              source={{
                uri: item.img,
              }}
            />
          </View>
        )}
      /> */}



      {/* {isLoading ? (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="white" />
        </View>
      ) : (
        <View style={{ backgroundColor: "red", flex: 1, width: width, height: height }}>
          <FlatList
            horizontal
            pagingEnabled
            data={DATA}
            // data={images}
            // renderItem={({ item }) => <Image style={{ width: width, height: height, }} source={{ uri: item.urls.regular }} />}
            renderItem={({ item }) => <Image style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').width, flex: 1 }}
              source={{ uri: item.img }} />}

          />
        </View>
      )
      } */}
    </View >
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#213131",
    backgroundColor: "pink",
    alignItems: "center",
    justifyContent: "center",
    // width: width,
    // height: height,
  },
  containerImage: {
    flex: 1,

  },
})