import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import useCustomFonts from "../hooks/useFonts";
import { useRouter } from "expo-router";
import Icon from 'react-native-vector-icons/FontAwesome'; // import thư viện icon
import { setUser } from "./auth";

export type User = {
  id: number,
  username: string,
  password: string,
  name: string
}

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState("");
  const [isSecure, setIsSecure] = useState(true);
  const [error, setError] = useState<string>("")
  const togglePasswordVisibility = () => {
    setIsSecure(!isSecure); 
  };

  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null; 

  const handleLogin = async () =>{
    if(username === "" || password === ""){
      setError("Không được để trống tên đăng nhập và mật khẩu")
      return
    }

    const user = {
      username,
      password,
      name: ""
    }
    try {
      const response = await fetch("http://192.168.224.239:8080/user/signin",
        {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(user)
        }
      )
      const jsonData = await response.json()

      if(jsonData.message == "successful"){
        setUser(jsonData.data)
        router.replace("/(tabs)/home")
      }else{
        setError(jsonData.message);
        return;
      }
    } catch (error) {
      setError("")
    }
  }


  return (
    <ImageBackground source={require("../assets/images/bg-signup.jpg")} style={styles.background}>
      <View style={styles.container}>
        {/* Logo */}
        <Text style={styles.logoText}>
          Sm<Text style={styles.logoTextBold}>irr</Text>
        </Text>


        {/* Welcome Text */}
        <Text style={styles.welcomeText}>Chào mừng trở lại</Text>
        <Text style={styles.subtitle}>Đăng nhập với tài khoản của bạn</Text>

        {/* Input Fields */}
        <TextInput
          style={styles.input}
          placeholder="Tên đăng nhập"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            placeholderTextColor="#aaa"
            secureTextEntry={isSecure}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.iconContainer} onPress={togglePasswordVisibility}>
            <Icon name={isSecure ? 'eye-slash' : 'eye'} size={20} color="#aaa" />
          </TouchableOpacity>
        </View>

        {error && (
          <View>
            <Text style={{color: "red", fontSize: 12, fontStyle: "italic"}}>{error}</Text>
          </View>
        )}

        {/* Forgot Password */}
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => handleLogin()}
        >
          <Text style={styles.loginButtonText}>ĐĂNG NHẬP</Text>
        </TouchableOpacity>


        {/* Sign Up Navigation */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Không có tài khoản?</Text>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={styles.signUpLink}> Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    width: "90%",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logoText: {
    fontSize: 32,
    fontFamily: "Quicksand-Bold",
    color: "#98C13F",
    fontWeight: "bold"
  },
  logoTextBold: {
    color: "#159148",
  },  
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  forgotPassword: {
    color: "#007BFF",
    alignSelf: "flex-end",
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    // position: 'relative',
    // backgroundColor: "#f5f5f5",
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
    height: '100%', // Đảm bảo icon chiếm đầy chiều cao của TextInput
    justifyContent: 'center', // Căn giữa icon dọc
    bottom: 8,
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#1E8449",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 20,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  signUpContainer: {
    flexDirection: "row",
  },
  signUpText: {
    color: "#666",
  },
  signUpLink: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});
