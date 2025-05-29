Arduino.forBlock['vl53l0x_config_i2c'] = function(block, generator) {
  var sda_pin = block.getFieldValue('SDA_PIN');
  var scl_pin = block.getFieldValue('SCL_PIN');
  
  // 添加Wire库
  generator.addLibrary('Wire', '#include <Wire.h>');
  
  // 初始化I2C总线
  var code = 'Wire.begin(' + sda_pin + ', ' + scl_pin + ');  // ESP32-S3 I2C 引脚配置 SDA: ' + sda_pin + ', SCL: ' + scl_pin + '\n';
  return code;
};

Arduino.forBlock['vl53l0x_begin'] = function(block, generator) {
  // 使用固定的变量名避免乱码
  var sensorVarName = 'sensor';
  var sda_pin = block.getFieldValue('SDA_PIN');
  var scl_pin = block.getFieldValue('SCL_PIN');
  
  // 添加Wire库和VL53L0X库
  generator.addLibrary('Wire', '#include <Wire.h>');
  generator.addLibrary('Adafruit_VL53L0X', '#include <Adafruit_VL53L0X.h>');
  generator.addObject(sensorVarName, 'Adafruit_VL53L0X ' + sensorVarName + ' = Adafruit_VL53L0X();');
  
  // 初始化I2C总线
  var code = '// 配置I2C引脚并初始化VL53L0X传感器\n';
  code += 'Wire.begin(' + sda_pin + ', ' + scl_pin + ');  // ESP32-S3 I2C 引脚配置 SDA: ' + sda_pin + ', SCL: ' + scl_pin + '\n\n';
  
  // 初始化传感器并检查连接
  code += 'if (!' + sensorVarName + '.begin()) {\n';
  code += '  Serial.println("传感器初始化失败！请检查连接。");\n';
  code += '  while (1); // 初始化失败，停止程序\n';
  code += '}\n\n';
  code += 'Serial.println("传感器初始化成功！");\n';
  return code;
};

// Arduino.forBlock['vl53l0x_read_distance'] = function(block, generator) {
//   // 使用固定的变量名避免乱码
//   var sensorVarName = 'sensor';
  
//   // 读取距离
//   var code = sensorVarName + '.readRange()';
//   return [code, Arduino.ORDER_FUNCTION_CALL];
// };

Arduino.forBlock['vl53l0x_ranging_test'] = function(block, generator) {
  // 使用固定的变量名避免乱码
  var sensorVarName = 'sensor';
  var measureVarName = 'measure';
  
  // 添加测量结果变量
  generator.addObject(measureVarName, 'VL53L0X_RangingMeasurementData_t ' + measureVarName + ';');
  
  // 进行测量
  var code = '// 获取距离数据（单位：毫米）\n';
  code += sensorVarName + '.rangingTest(&' + measureVarName + ', false);  // 进行一次测量\n';
  return code;
};

Arduino.forBlock['vl53l0x_check_range_valid'] = function(block, generator) {
  // 使用固定的变量名避免乱码
  var measureVarName = 'measure';
  
  // 检查测量结果是否有效
  var code = measureVarName + '.RangeStatus != 4';
  return [code, Arduino.ORDER_RELATIONAL];
};

Arduino.forBlock['vl53l0x_get_range_mm'] = function(block, generator) {
  // 使用固定的变量名避免乱码
  var measureVarName = 'measure';
  
  // 获取距离值
  var code = measureVarName + '.RangeMilliMeter';
  return [code, Arduino.ORDER_MEMBER];
};