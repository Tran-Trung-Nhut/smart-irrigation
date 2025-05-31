import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Switch,
} from "react-native";
import useCustomFonts from "../hooks/useFonts";
import { useRouter } from "expo-router";
import Icon from 'react-native-vector-icons/FontAwesome'; // import thư viện 
import { setUser } from "./auth";

export default function SignupScreen() {
  const router = useRouter();
  const [error, setError] = useState<string>("")
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSecure, setIsSecure] = useState(true);
  const [isSecure1, setIsSecure1] = useState(true);
  const togglePasswordVisibility = () => {
    setIsSecure(!isSecure); // Chuyển đổi trạng thái ẩn/hiện mật khẩu
  };
  const toggleConfirmPasswordVisibility = () => {
    setIsSecure1(!isSecure1); // Chuyển đổi trạng thái ẩn/hiện mật khẩu
  };
  const [isChecked, setIsChecked] = useState(false);

  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null; // Chờ tải font trước khi render UI
  
  const handleSignUp = async () => {
    if(username === "" || password === "" || name === "" || confirmPassword === ""){
      setError("Không được để trống bất kỳ trường nào")
      return
    }

    if(password !== confirmPassword){
      setError("Trường mật khẩu và xác nhận mật khẩu không giống nhau");
      return
    }

    const user = {
      username,
      password,
      name
    }

    try {
      const response = await fetch("http://localhost:8080/user/signup",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      })
      const jsonData = await response.json()

      if(jsonData.message == "successful"){
        setUser(jsonData.data);
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

        {/* Title */}
        <Text style={styles.logoText}>
            Sm<Text style={styles.logoTextBold}>irr</Text>
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Tên đăng nhập"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Họ và tên"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
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

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Xác nhận mật khẩu"
            placeholderTextColor="#aaa"
            secureTextEntry={isSecure1}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity style={styles.iconContainer} onPress={toggleConfirmPasswordVisibility}>
            <Icon name={isSecure1 ? 'eye-slash' : 'eye'} size={20} color="#aaa" />
          </TouchableOpacity>
        </View>

        {error && (
          <View>
            <Text style={{color: "red", fontSize: 12, fontStyle: "italic"}}>{error}</Text>
          </View>
        )}
        

        {/* Terms & Conditions */}
        <View style={styles.checkboxContainer}>
          <Switch value={isChecked} onValueChange={setIsChecked}/>
          <Text style={styles.termsText}>
            Nếu bạn đăng ký, bạn chấp nhận với{" "}
            <Text style={styles.link}>Điều khoản dịch vụ</Text> và{" "}
            <Text style={styles.link}>Chính sách quyền riêng tư</Text>.
          </Text>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.signupButton} onPress={() => handleSignUp()}>
          <Text style={styles.signupButtonText}>ĐĂNG KÝ</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Bạn đã có tài khoản?</Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.loginLink}> Đăng nhập</Text>
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
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  termsText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 10,
    flex: 1,
  },
  link: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  signupButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#1E8449",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 15,
  },
  signupButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    justifyContent: "center",
    borderRadius: 10,
    marginBottom: 20,
  },
  googleIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    marginRight: 10,
  },
  googleText: {
    fontSize: 16,
    color: "#333",
  },
  loginContainer: {
    flexDirection: "row",
  },
  loginText: {
    color: "#666",
  },
  loginLink: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});
