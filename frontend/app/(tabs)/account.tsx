import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Modal,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import useCustomFonts from "../../hooks/useFonts";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Icon from 'react-native-vector-icons/FontAwesome';
import { currentUser } from "../auth";
import { logout, setUser } from "../auth";

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState<string>("")
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSecurePassword, setIsSecurePassword] = useState(true);
  const [isSecureConfirmPassword, setIsSecureConfirmPassword] = useState(true);
  const [isSecureCurrentPassword, setIsSecureCurrentPassword] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [error, setError] = useState<string>("")

  const togglePasswordVisibility = () => {
    setIsSecurePassword(!isSecurePassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setIsSecureConfirmPassword(!isSecureConfirmPassword);
  };

  const toggleCurrentPasswordVisibility = () => {
    setIsSecureCurrentPassword(!isSecureCurrentPassword);
  };
  
  const openPasswordModal = () => {
    setPasswordModalVisible(true);
  };

  const closePasswordModal = () => {
    setPasswordModalVisible(false);
    setCurrentPassword("");
  };
  
  const handlePasswordSubmit = () => {
    // TODO: Add actual password validation here
    if (currentPassword.length > 0) {
      
      if(currentPassword === password){
        setPasswordModalVisible(false);
        setEditMode(true);
        setCurrentPassword("")
        setError("")
      }else{
        setError("Mật khẩu không chính xác")
      }
    } else {
      setError("Vui lòng nhập mật khẩu!");
    }
  };

  const toggleEditMode = () => {
    if (!editMode) {
      // Entering edit mode - show password modal
      openPasswordModal();
    } else {
      // Exiting edit mode
      setEditMode(false);
      // Reset password fields
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleSubmit = async () => {
    if (editMode) {
      if(!newPassword || !confirmPassword) {
        setError("Không được để trống mật khẩu mới và xác nhận mật khẩu")
        return
      }
  
      if (newPassword && newPassword !== confirmPassword) {
        setError("Mật khẩu mới và xác nhận mật khẩu không khớp!");
        return;
      }
      
      const user = {
        username,
        password: newPassword,
        name
      }

      try {
        const response = await fetch("http://localhost:8080/user/change-password",
          {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
          })

          const jsonData = await response.json()

          if(jsonData.message !== "successful"){
            setError(jsonData.message)
          }else{
            setUser(jsonData.data)
            setEditMode(false);
            setNewPassword("");
            setConfirmPassword("");
            setCurrentPassword("")
            setError("")
          }
      } catch (error) {
        
      }
    } else {
      // Handle "Đăng xuất"
      logout()
      router.replace("/login");
    }
  };

  const fontsLoaded = useCustomFonts();
  if (!fontsLoaded) return null;

  const fetchUser = () => {
    if (currentUser === null) return

    setUsername(currentUser.username)
    setName(currentUser.name)
    setPassword(currentUser.password)
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <SafeAreaView style={styles.containerAll}>
      <ImageBackground source={require("../../assets/images/bg-signup.jpg")} style={styles.background} />

      <View style={styles.header}>
        <Text style={styles.logo}>
          Sm<Text style={styles.logoBold}>irr</Text>
        </Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.containerfull}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <Text style={styles.welcomeText}>Thông tin tài khoản</Text>
            <Text style={styles.subtitle}>{editMode ? 'Chỉnh sửa thông tin tài khoản' : 'Xem thông tin tài khoản của bạn'}</Text>

            {editMode && <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>}

            <View style={styles.infoContainer}>
              <Text style={styles.label}>Tên đăng nhập:</Text>
              {editMode ? (
                <TextInput
                  style={styles.input}
                  placeholder="Tên đăng nhập"
                  placeholderTextColor="#aaa"
                  value={username}
                  onChangeText={setUsername}
                />
              ) : (
                <Text style={styles.infoText}>{username}</Text>
              )}
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.label}>Họ và tên:</Text>
              {editMode ? (
                <TextInput
                  style={styles.input}
                  placeholder="Họ và tên"
                  placeholderTextColor="#aaa"
                  value={name}
                  onChangeText={setName}
                />
              ) : (
                <Text style={styles.infoText}>{name}</Text>
              )}
            </View>

            {editMode && (
              <>
                <Text style={[styles.sectionTitle, {marginTop: 20}]}>Thay đổi mật khẩu</Text>
                <Text style={styles.passwordNote}>Để trống nếu không muốn thay đổi mật khẩu</Text>

                <View style={styles.infoContainer}>
                  <Text style={styles.label}>Mật khẩu mới:</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Mật khẩu mới"
                      placeholderTextColor="#aaa"
                      secureTextEntry={isSecurePassword}
                      value={newPassword}
                      onChangeText={setNewPassword}
                    />
                    <TouchableOpacity style={styles.iconContainer} onPress={togglePasswordVisibility}>
                      <Icon name={isSecurePassword ? 'eye-slash' : 'eye'} size={20} color="#aaa" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.infoContainer}>
                  <Text style={styles.label}>Xác nhận mật khẩu:</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Xác nhận mật khẩu"
                      placeholderTextColor="#aaa"
                      secureTextEntry={isSecureConfirmPassword}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity style={styles.iconContainer} onPress={toggleConfirmPasswordVisibility}>
                      <Icon name={isSecureConfirmPassword ? 'eye-slash' : 'eye'} size={20} color="#aaa" />
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}

            {error && (
              <View>
                <Text style={{color: "red", fontSize: 12, fontStyle: "italic"}}>{error}</Text>
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, editMode ? styles.agreeButton : styles.logoutButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>{editMode ? 'ĐỒNG Ý' : 'ĐĂNG XUẤT'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={toggleEditMode}
              >
                <Text style={styles.editButtonText}>{editMode ? 'HỦY' : 'SỬA'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Password Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={passwordModalVisible}
        onRequestClose={closePasswordModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Xác nhận mật khẩu</Text>
            <Text style={styles.modalSubtitle}>Vui lòng nhập mật khẩu hiện tại để tiếp tục</Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.modalInput}
                placeholder="Nhập mật khẩu hiện tại"
                placeholderTextColor="#aaa"
                secureTextEntry={isSecureCurrentPassword}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                autoFocus={true}
              />
              <TouchableOpacity style={styles.iconContainer} onPress={toggleCurrentPasswordVisibility}>
                <Icon name={isSecureCurrentPassword ? 'eye-slash' : 'eye'} size={20} color="#aaa" />
              </TouchableOpacity>
            </View>
            {error && (
              <View>
                <Text style={{color: "red", fontSize: 12, fontStyle: "italic"}}>{error}</Text>
              </View>
            )}

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={closePasswordModal}>
                <Text style={styles.modalCancelButtonText}>HỦY</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.modalConfirmButton} onPress={handlePasswordSubmit}>
                <Text style={styles.modalConfirmButtonText}>XÁC NHẬN</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerAll: {
    flex: 1,
  },
  header: { 
    flexDirection: "row", 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: 'white',
    paddingTop: 20, 
    paddingLeft: 15, 
    paddingRight: 15, 
    paddingBottom: 10
  },
  background: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    resizeMode: "cover",
  },
  containerfull: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
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
  logo: { 
    fontSize: 30, 
    fontWeight: "bold", 
    color: "#98C13F"
  },
  logoBold: { 
    color: "#159148", 
    fontWeight: "bold" 
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  passwordNote: {
    fontSize: 12,
    color: "#666",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  infoContainer: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
    height: '100%',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  logoutButton: {
    backgroundColor: "red",
    width: "48%",
  },
  agreeButton: {
    backgroundColor: "#1E8449",
    width: "48%",
  },
  editButton: {
    backgroundColor: "#f5f5f5",
    width: "48%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  editButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    width: '100%',
    height: 50,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  modalCancelButton: {
    backgroundColor: '#f5f5f5',
    width: '48%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  modalConfirmButton: {
    backgroundColor: '#1E8449',
    width: '48%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  modalCancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalConfirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});