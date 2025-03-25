import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, List, Card, PaperProvider, Divider, Chip } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import { en, registerTranslation } from 'react-native-paper-dates';
registerTranslation('en', en);
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import useCustomFonts from "../../hooks/useFonts";
import { format } from 'date-fns';

// TimePicker Component (Integrated directly in this file)
const TimePicker = ({ value, onChange, label }) => {
  const [visible, setVisible] = useState(false);
  const [hours, setHours] = useState(value ? value.getHours().toString().padStart(2, '0') : '00');
  const [minutes, setMinutes] = useState(value ? value.getMinutes().toString().padStart(2, '0') : '00');

  const handleOpen = () => {
    setHours(value ? value.getHours().toString().padStart(2, '0') : '00');
    setMinutes(value ? value.getMinutes().toString().padStart(2, '0') : '00');
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
  };

  const handleConfirm = () => {
    // Use default value "00" if field is empty
    const h = hours === '' ? '00' : hours;
    const m = minutes === '' ? '00' : minutes;
    
    // Create a new date object with the selected time
    const newDate = new Date(value);
    newDate.setHours(parseInt(h, 10));
    newDate.setMinutes(parseInt(m, 10));
    
    onChange(newDate);
    handleClose();
  };

  // Format the time for display in the input field
  const formatTime = (date) => {
    if (!date) return '';
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <View>
      <TextInput
        label={label}
        value={formatTime(value)}
        onFocus={handleOpen}
        style={timePickerStyles.input}
      />
      
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={timePickerStyles.modalOverlay}>
          <View style={timePickerStyles.modalContent}>
            <Text style={timePickerStyles.modalTitle}>Chọn thời gian</Text>
            
            <View style={timePickerStyles.timeContainer}>
              {/* Hours input */}
              <View style={timePickerStyles.timeFieldContainer}>
                <TextInput
                  value={hours}
                  onChangeText={(text) => {
                    // Only allow numbers and limit to 2 digits
                    const filtered = text.replace(/[^0-9]/g, '').slice(0, 2);
                    // Ensure hours are between 0-23
                    if (filtered === '' || parseInt(filtered, 10) <= 23) {
                      setHours(filtered);
                    }
                  }}
                  keyboardType="number-pad"
                  style={timePickerStyles.timeField}
                  maxLength={2}
                />
                <Text style={timePickerStyles.timeLabel}>Giờ</Text>
              </View>
              
              <Text style={timePickerStyles.timeSeparator}>:</Text>
              
              {/* Minutes input */}
              <View style={timePickerStyles.timeFieldContainer}>
                <TextInput
                  value={minutes}
                  onChangeText={(text) => {
                    // Only allow numbers and limit to 2 digits
                    const filtered = text.replace(/[^0-9]/g, '').slice(0, 2);
                    // Ensure minutes are between 0-59
                    if (filtered === '' || parseInt(filtered, 10) <= 59) {
                      setMinutes(filtered);
                    }
                  }}
                  keyboardType="number-pad"
                  style={timePickerStyles.timeField}
                  maxLength={2}
                />
                <Text style={timePickerStyles.timeLabel}>Phút</Text>
              </View>
            </View>
            
            <View style={timePickerStyles.buttonContainer}>
              <TouchableOpacity onPress={handleClose} style={timePickerStyles.button}>
                <Text style={timePickerStyles.buttonText}>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirm} style={timePickerStyles.button}>
                <Text style={[timePickerStyles.buttonText, timePickerStyles.confirmButton]}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// TimePicker Styles
const timePickerStyles = StyleSheet.create({
  input: {
    // backgroundColor: 'white',
    color: 'black',
    borderRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    color: 'white',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  timeFieldContainer: {
    alignItems: 'center',
    width: 100,
  },
  timeField: {
    backgroundColor: '#444',
    color: 'white',
    fontSize: 48,
    width: 100,
    textAlign: 'center',
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4a86e8',
  },
  timeLabel: {
    marginTop: 8,
    color: '#ccc',
    fontSize: 16,
  },
  timeSeparator: {
    fontSize: 48,
    marginHorizontal: 10,
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    padding: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#4a86e8',
  },
  confirmButton: {
    fontWeight: 'bold',
  },
});

// Define types for schedule object
type Schedule = {
    startTime: Date;
    startDate: Date;
    endDate: Date;
    frequency: number;
    duration: number;
};

function WateringSchedule() {
    const [startDate, setStartDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [frequency, setFrequency] = useState(1);
    const [duration, setDuration] = useState(30);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [selectedDates, setSelectedDates] = useState<Date[]>([]);
    const insets = useSafeAreaInsets();

    const handleAddSchedule = () => {
      // Create complete datetime objects by combining date and time
      const completeStartDateTime = new Date(startDate);
      completeStartDateTime.setHours(
          startTime.getHours(),
          startTime.getMinutes(),
          0, 0
      );
  
      // Now compare the complete datetime objects
      if (!completeStartDateTime || !endDate || completeStartDateTime >= endDate) {
          alert('Vui lòng nhập lại (Ngày kết thúc phải sau Ngày bắt đầu).');
          return;
      }
      if (duration <= 0) {
        alert('Vui lòng nhập thời lượng tưới hợp lệ.');
        return;
      }
      if (frequency === null || isNaN(frequency) || frequency <= 0) {
          alert('Vui lòng nhập lại (Tần suất không được bằng 0).');
          return;
      }
      
      // Store complete datetime objects in the schedule
      const newSchedule: Schedule = { 
          startTime: completeStartDateTime, 
          startDate,
          endDate,
          duration: Number(duration),
          frequency 
      };
      
      setSchedules([...schedules, newSchedule]);
    };

    const computeDates = ({ startTime, endDate, frequency }: Schedule) => {
        const dates: Date[] = [];
        let current = new Date(startTime);
        
        // Get just the date part of endDate
        const endDateOnly = new Date(endDate);
        endDateOnly.setHours(0, 0, 0, 0);
        
        // Add one day to include the end date fully
        endDateOnly.setDate(endDateOnly.getDate() + 1);
        
        while (current < endDateOnly) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + frequency);
        }
        return dates;
    };

    const formatDateTime = (date: Date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    };
  
    const handleSelectSchedule = (schedule: Schedule) => {
        const dates = computeDates(schedule);
        setSelectedDates(dates);
    };

    const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatWateringTime = (startTime, duration) => {
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + duration);
      
      const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      };
      
      return `${formatTime(startTime)} - ${formatTime(endTime)}`;
    };

    return (
        <PaperProvider>
            <ScrollView style={[styles.container]}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.logo}>
                        Sm<Text style={styles.logoBold}>irr</Text>
                    </Text>
                    <Ionicons name="notifications-outline" size={24} color="black" />
                </View>
                <Text variant="headlineMedium" style={styles.title}>Watering Schedule</Text>

                {/* Start Date and Time - Modified column ratio */}
                <View style={styles.inputContainer}>
                    {/* Start Date - Now 2/3 width */}
                    <View style={styles.dateInputLeft}>
                        <DatePickerInput
                            label="Ngày bắt đầu"
                            value={startDate}
                            onChange={(d) => setStartDate(d || new Date())}
                            locale="vn"
                            style={styles.datePicker}
                            inputMode="date"
                        />
                    </View>
                    
                    {/* Start Time - Now 1/3 width */}
                    <View style={styles.dateInputRight}>
                        <TimePicker
                            label="Giờ tưới"
                            value={startTime}
                            onChange={(newTime) => {
                                // Create a new date that combines the selected date with the new time
                                const combinedDate = new Date(startDate);
                                combinedDate.setHours(newTime.getHours(), newTime.getMinutes());
                                setStartTime(combinedDate);
                            }}
                            style={styles.datePicker}
                        />
                    </View>
                </View>

                {/* End Date and Duration */}
                <View style={styles.inputContainer}>
                    {/* End Date - Now 2/3 width */}
                    <View style={styles.dateInputLeft}>
                        <DatePickerInput
                            label="Ngày kết thúc"
                            value={endDate}
                            onChange={(d) => setEndDate(d || new Date())}
                            locale="vn"
                            style={styles.datePicker}
                        />
                    </View>
                    {/* Duration - Now 1/3 width */}
                    <View style={styles.dateInputRight}>
                    <TextInput
                            label="Tưới trong (phút)" 
                            value={duration.toString()}
                            onChangeText={(text) => {
                                // If user deletes all input, set to empty string
                                if (text === '') {
                                    setDuration(0);
                                } else {
                                    // Update duration if it's a valid number
                                    const newDuration = parseInt(text, 10);
                                    if (!isNaN(newDuration)) {
                                        setDuration(newDuration);
                                    }
                                }
                            }}
                            keyboardType="number-pad"
                            style={styles.textInput}
                        />
                    </View>
                </View>

                <TextInput
                    label="Tuần suất (ngày)"
                    value={frequency.toString()}
                    onChangeText={(text) => {
                        // If user deletes all input, set to 0
                        if (text === '') {
                            setFrequency(0);
                        } else {
                            // Update frequency if it's a valid number
                            const newFrequency = parseInt(text, 10);
                            if (!isNaN(newFrequency)) {
                                setFrequency(newFrequency);
                            }
                        }
                    }}
                    keyboardType="number-pad"
                    style={[styles.frequencyInput, { color: 'black' }]}
                />

                <Button mode="contained" onPress={handleAddSchedule} style={styles.addButton}>
                    Thêm lịch
                </Button>

                <Divider style={styles.divider} />

                <Text variant="titleLarge" style={styles.sectionTitle}>Danh sách lịch tưới</Text>
                {schedules.length > 0 ? (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scheduleList}>
        {schedules.map((schedule, index) => (
            <Card 
                key={index} 
                style={styles.scheduleCard}
                onPress={() => handleSelectSchedule(schedule)}
            >
                <Card.Content>
                    <Text style={styles.scheduleCardTitle}>Lịch tưới #{index + 1}</Text>
                    <Text style={styles.scheduleCardDetail}>
                        Thời gian tưới: {formatWateringTime(schedule.startTime, schedule.duration)}
                    </Text>
                    <Text style={styles.scheduleCardDetail}>
                        Thời gian: {formatDate(schedule.startDate)} - {formatDate(schedule.endDate)}
                    </Text>
                    <Text style={styles.scheduleCardDetail}>
                        Tần suất: Cách {schedule.frequency} ngày
                    </Text>
                </Card.Content>
            </Card>
        ))}
    </ScrollView>
) : (
    <Text style={styles.noSchedulesText}>No schedules saved yet.</Text>
)}

                <Divider style={styles.divider} />

                {selectedDates.length > 0 && (
                    <View>
                        <Text variant="titleLarge" style={styles.sectionTitle}>Ngày tưới:</Text>
                        <View style={styles.wateringDatesContainer}>
                            {selectedDates.map((date, index) => (
                                <Text key={index} style={styles.wateringDate}>
                                    {formatDateTime(date)}
                                </Text>
                            ))}
                        </View>
                    </View>
                )}
            </ScrollView>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, paddingTop: 20, paddingBottom: 20, paddingLeft: 15, paddingRight: 15, backgroundColor: "white"
    },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    logo: { fontSize: 30, fontWeight: "bold", color: "#98C13F"},
    logoBold: { color: "#159148", fontWeight: "bold" },
    title: {
        marginBottom: 15,
        textAlign: 'center',
        color: "FFFFFF",
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    // New styles for the 2/3 and 1/3 column width
    dateInputLeft: {
        flex: 2,
        marginRight: 8,
        color: "black"
    },
    dateInputRight: {
        flex: 1,
        color: "black"
    },
    // Keep the original dateInput for backward compatibility
    dateInput: {
        flex: 1,
        marginRight: 8,
        color: "black"
    },
    frequencyInput: {
        marginBottom: 10,
        backgroundColor: "white",
        color: "black"
    },
    textInput: {
        // backgroundColor: "white",
        color: "black",
        borderRadius: 10,
    },
    addButton: {
        marginTop: 10,
    },
    sectionTitle: {
        marginTop: 10,
        marginBottom: 12,
        color: "green"
    },
    scheduleList: {
        marginBottom: 10,
    },
    scheduleChip: {
        marginRight: 8,
        marginBottom: 8,
    },
    wateringDatesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    wateringDate: {
        marginRight: 8,
        marginBottom: 8,
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#e0e0e0',
        color: "black"
    },
    divider: {
        marginVertical: 5,
    },
    datePicker: {
        borderRadius: 10,
        padding: 0,
        margin: 0,
    },
    noSchedulesText: {
        color: 'gray',
    },
    scheduleCard: {
      // width: 260,
      marginRight: 12,
      marginBottom: 8,
      elevation: 2,
       backgroundColor: 'white'
  },
  scheduleCardTitle: {
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#159148',
  },
  scheduleCardDetail: {
      fontSize: 14,
      marginBottom: 3,
      color: 'black',
     
  },
});

export default WateringSchedule;