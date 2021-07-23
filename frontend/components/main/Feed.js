import React, { useState, useEffect }  from 'react'
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, Button } from 'react-native'

import {connect} from 'react-redux'
import firebase from 'firebase'
require('firebase/firestore')

function Feed(props) {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        let posts = []
        console.log(props)
        if (props.usersFollowingLoaded == props.following.length && props.following.length !== 0) {
            // for (let i = 0; i < props.following.length; i++) {
            //     const user = props.users.find(el => el.uid === props.following[i]);
            //     if (user != undefined) {
            //         posts = [...posts, ...user.posts]
            //     }
            // }
            props.feed.sort(function(x, y) {
                return x.creation - y.creation
            })
            setPosts(props.feed)
        }
        console.log("Feed posts ", posts)

    }, [props.usersFollowingLoaded, props.feed])

    const onLikePress = (userId, postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .set({})
    }
    const onDislikePress = (userId, postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .delete()
    }

    return (

        <View style={styles.container}>

            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    renderItem={({ item }) => (
                        <View
                            style={styles.containerImage}>
                            <Text style={styles.container} >{item.user.name}</Text>
                            <Image
                                style={{ width: 100, height: 100 }}
                                source={{ uri: item.downloadURL }}
                            />
                            { item.currentUserLike ? 
                                (
                                    <Button 
                                        title="Dislike"
                                        onPress={()=> onDislikePress(item.user.uid, item.id)}
                                    />
                                ) : (
                                    <Button 
                                        title="Like"
                                        onPress={()=> onLikePress(item.user.uid, item.id)}
                                    />
                                )
                            }
                            <Text
                                onPress={()=> 
                                    props.navigation.navigate('Comment', 
                                    {postId: item.id, uid: item.user.uid}
                                    )}
                            >View Comments...</Text>
                        </View>

                    )}

                />

            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerInfo: {
        margin: 20
    },
    containerGallery: {
        flex: 1
    },
    containerImage: {
        flex: 1 / 3

    },
    image: {
        flex: 1,
        aspectRatio: 1 / 1
    }
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    // users: store.usersState.users,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded,
})
export default connect(mapStateToProps, null)(Feed);