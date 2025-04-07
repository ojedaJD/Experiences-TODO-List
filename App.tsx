import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image,
    ScrollView,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import { Swipeable } from 'react-native-gesture-handler';

type Experience = {
    id: string;
    title: string;
    completed: boolean;
    photoUris: string[];
};

export default function App() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [newTitle, setNewTitle] = useState('');

    const addExperience = () => {
        if (!newTitle.trim()) return;
        const newExp: Experience = {
            id: Date.now().toString(),
            title: newTitle.trim(),
            completed: false,
            photoUris: [],
        };
        setExperiences([...experiences, newExp]);
        setNewTitle('');
    };

    const markComplete = async (id: string) => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert('Permission to access photos is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        const selectedPhotoUri = !result.canceled ? result.assets[0].uri : undefined;

        setExperiences((prev) =>
            prev.map((exp) =>
                exp.id === id
                    ? { ...exp, completed: true, photoUris: selectedPhotoUri ? [selectedPhotoUri] : [], }
                    : exp
            )
        );
    };

    const addPhotoToExperience = async (id: string) => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert('Permission to access photos is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        const selectedPhotoUri = !result.canceled ? result.assets[0].uri : undefined;

        if (selectedPhotoUri) {
            setExperiences((prev) =>
                prev.map((exp) =>
                    exp.id === id
                        ? {
                            ...exp,
                            photoUris: [...exp.photoUris, selectedPhotoUri],
                        }
                        : exp
                )
            );
        }
    };

    const confirmDelete = (id: string) => {
        Alert.alert(
            'Delete Experience',
            'Are you sure you want to delete this experience?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setExperiences((prev) => prev.filter((exp) => exp.id !== id));
                    },
                },
            ]
        );
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={styles.header}>Antonieta's List</Text>

                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="Add new experience"
                        placeholderTextColor="#aaa"
                        value={newTitle}
                        onChangeText={setNewTitle}
                    />
                    <Button title="Add" onPress={addExperience} />
                </View>

                <FlatList
                    data={experiences}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Swipeable
                            renderRightActions={() => (
                                <View style={styles.deleteContainer}>
                                    <TouchableOpacity onPress={() => confirmDelete(item.id)}>
                                        <Text style={styles.deleteText}>🗑️ Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        >
                            <View style={styles.listItem}>
                                <View style={{ flex: 1 }}>
                                    <Text
                                        style={[styles.itemText, item.completed && styles.completedText]}
                                    >
                                        {item.title}
                                    </Text>

                                    {item.completed && item.photoUris.length > 0 && (
                                        <ScrollView
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            style={{ marginTop: 10 }}
                                        >
                                            {item.photoUris.map((uri, index) => (
                                                <Image
                                                    key={index}
                                                    source={{ uri }}
                                                    style={{
                                                        width: 120,
                                                        height: 120,
                                                        marginRight: 10,
                                                        borderRadius: 8,
                                                    }}
                                                    resizeMode="cover"
                                                />
                                            ))}
                                        </ScrollView>
                                    )}

                                    {item.completed && (
                                        <TouchableOpacity
                                            style={styles.addPhotoBtn}
                                            onPress={() => addPhotoToExperience(item.id)}
                                        >
                                            <Text style={styles.addPhotoText}>+ Add Photo</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>

                                {!item.completed && (
                                    <TouchableOpacity onPress={() => markComplete(item.id)}>
                                        <Text style={styles.completeBtn}>✔️</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </Swipeable>
                    )}
                />
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        padding: 20,
        paddingTop: 60,
    },
    header: {
        fontSize: 28,
        fontWeight: '600',
        color: '#ff69b4',
        textAlign: 'center',
        marginBottom: 30,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        backgroundColor: '#2a2a2a',
        color: '#fff',
        borderWidth: 1,
        borderColor: '#ff69b4',
        padding: 10,
        borderRadius: 10,
        marginRight: 10,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2a2a2a',
        padding: 15,
        marginVertical: 6,
        borderRadius: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#ff69b4',
    },
    itemText: {
        fontSize: 16,
        color: '#fff',
        flex: 1,
    },
    completedText: {
        color: '#888',
        textDecorationLine: 'line-through',
    },
    completeBtn: {
        fontSize: 18,
        color: '#ff69b4',
        paddingHorizontal: 10,
    },
    deleteContainer: {
        backgroundColor: '#ff4d6d',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: '100%',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    deleteText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    addPhotoBtn: {
        marginTop: 10,
        padding: 8,
        backgroundColor: '#ff69b4',
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    addPhotoText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
