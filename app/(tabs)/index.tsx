import { router, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  FlatList,
Button,
} from "react-native";
// import  db, {firebase}  from "@react-native-firebase/database";
import { fetchPosts } from "@/features/posts/operations";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { selectUserPosts } from "@/features/posts/postsSelectors";
import { LatLng } from "react-native-maps";
import { nanoid } from "@reduxjs/toolkit"; 
import { getAuth, onAuthStateChanged, FirebaseAuthTypes } from '@react-native-firebase/auth';
import {getDatabase, set, ref} from "@react-native-firebase/database";

import ImageViewer from "@/components/imageViwer";
import UserImage from "@/components/userImage";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";


export default function PostsScreen() {
  const dispatch = useAppDispatch();
  const segments = useSegments();
  const [hasMounted, setHasMounted] = useState(false);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();
  const [initializing, setInitializing] = useState<boolean>(true);
  // const selectedPosts = useAppSelector(selectUserPosts);
  // const postsArray = Object.entries(selectedPosts);
  const postArray: ArrayLike<any> | null | undefined = []
const postId = nanoid()
const auth = getAuth();


  const currentUser = (user: FirebaseAuthTypes.User | null) => {
    setUser(user);
      console.log("User:", user);
    if (initializing) {
      setInitializing(false);
    }
  };

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, currentUser);
    // dispatch(fetchPosts());
    return subscriber;
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setHasMounted(true);
    }, 500);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;
    const currentSegment = segments[0] === "(tabs)";
    if (!user && currentSegment) {
      router.replace("/(tabs)/loginScreen");
    } else {
      return;
    }
  }, [user, hasMounted]);

  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleLinkToMapScreen = (location: LatLng, locationMark: string) => {
    router.push({
      pathname: "/mapScreen",
      params: {
        latitude: location?.latitude,
        longitude: location?.longitude,
        currentLocation: locationMark,
      },
    });
  };

  const handleLinkToComments = (postId: string, postImage: string) => {
    router.push({
      pathname: "/(tabs)/commentsScreen",
      params: {
        selectedPostId: postId,
        selectedImage: postImage,
      },
    });
  };

  const handlePost = async () => {
    try {const db = getDatabase();
    set(ref(db, 'users/' + postId), {
      username: user?.displayName,
      email: user?.email,
    })} catch (error: any) {  
       console.log( error.message,);
      };  
    } 

// const handlePost = () => {
//    firebase.app().
//   database().ref(`/posts/test`).set({Name: "Mango"})
//       .then(() => {
//         console.log('Post data written successfully!');
//       })
//       .catch((error) => {
//         console.error('Error writing post data:', error);
       
//       });}

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.userPostContainer}>
      <View style={styles.userContainer}>
        <View style={styles.photoContainer}>
          {!item[1].userImage ? (
            <FontAwesome5 name="user" size={44} color="lightgrey" />
          ) : (
            <UserImage selectedImage={item[1].userImage} />
          )}
        </View>
        <View>
          <Text style={styles.textName}>{item[1].userName}</Text>
          <Text style={styles.textEmail}>{item[1].userEmail}</Text>
        </View>
      </View>
      <View style={styles.userPost}>
        <View style={styles.postImage}>
          <ImageViewer selectedImage={item[1].postImage} />
        </View>
        <Text style={styles.imageText}>{item[1].imageName}</Text>
        <View style={styles.imageDescr}>
          <View
            style={{
              flex: 1,
              gap: 6,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <FontAwesome
              name="comment-o"
              size={24}
              color="#BDBDBD"
              onPress={() => handleLinkToComments(item[0], item[1].postImage)}
            />
            <Text style={[styles.imageText, { color: "#BDBDBD" }]}>0</Text>
          </View>
          <Pressable
            onPress={() =>
              handleLinkToMapScreen(item[1].postLocation, item[1].locationMark)
            }
            style={{
              gap: 4,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Feather name="map-pin" size={24} color="#BDBDBD" />
            <Text
              style={[styles.imageText, { textDecorationLine: "underline" }]}
            >
              {item[1].imageName}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View><Text>Hello {user?.displayName}!</Text></View>
      <FlatList
        data={postArray}
        keyExtractor={(item) => item[0]}
        renderItem={renderItem}
       />

      <Button title="AddPost" onPress={handlePost}/>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFF",
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  userPostContainer: {
    flex: 1,
    gap: 32,
    marginBottom: 32,
  },
  userContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  photoContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "gray",
    overflow: "hidden",
  },
  textName: {
    fontFamily: "Roboto",
    color: "#212121",
    fontSize: 13,
    fontWeight: 700,
  },
  textEmail: {
    fontFamily: "Roboto",
    color: "rgba(33, 33, 33, 0.80)",
    fontSize: 11,
  },
  userPost: {
    flex: 1,
    gap: 8,
    marginHorizontal: "auto",
  },
  postImage: {
    width: 343,
    height: 240,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "auto",
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
    borderColor: "#E8E8E8",
    backgroundColor: "#F6F6F6",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageText: {
    color: "#212121",
    fontFamily: "Roboto",
    fontSize: 16,
  },
  imageDescr: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
