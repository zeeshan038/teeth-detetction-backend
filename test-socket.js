const io = require('socket.io-client');

class SocketTester {
  constructor(serverUrl = 'http://localhost:3000') {
    this.serverUrl = serverUrl;
    this.clients = {};
    this.testResults = [];
  }

  // Create a socket client
  createClient(userId) {
    const socket = io(this.serverUrl, {
      query: { userId }
    });

    this.clients[userId] = socket;
    this.setupEventListeners(socket, userId);
    return socket;
  }

  // Setup event listeners for a socket
  setupEventListeners(socket, userId) {
    socket.on('connect', () => {
      this.log(`✅ ${userId} connected successfully`);
    });

    socket.on('disconnect', () => {
      this.log(`❌ ${userId} disconnected`);
    });

    socket.on('newMessage', (data) => {
      this.log(`📨 ${userId} received message: "${data.message}" from ${data.sender.firstName}`);
    });

    socket.on('messageSent', (data) => {
      this.log(`✅ ${userId} message sent confirmation: ${data.messageId}`);
    });

    socket.on('userTyping', (data) => {
      this.log(`⌨️  ${userId} sees ${data.userId} typing: ${data.isTyping}`);
    });

    socket.on('userOnline', (data) => {
      this.log(`🟢 ${userId} sees ${data.userId} came online`);
    });

    socket.on('userOffline', (data) => {
      this.log(`🔴 ${userId} sees ${data.userId} went offline`);
    });

    socket.on('messagesRead', (data) => {
      this.log(`👁️  ${userId} messages read by ${data.readBy} in conversation ${data.conversationId}`);
    });

    socket.on('messagesMarkedAsRead', (data) => {
      this.log(`✅ ${userId} marked messages as read in conversation ${data.conversationId}`);
    });

    socket.on('userStatus', (data) => {
      this.log(`📊 ${userId} user status check: ${data.userId} is ${data.isOnline ? 'online' : 'offline'}`);
    });

    socket.on('error', (data) => {
      this.log(`❌ ${userId} error: ${data.message}`);
    });
  }

  // Utility function for logging
  log(message) {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    this.testResults.push(logMessage);
  }

  // Wait for a specified time
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Test 1: Basic Connection
  async testConnection() {
    this.log('\n🚀 TEST 1: Basic Connection');
    
    const doctor = this.createClient('doctor1');
    const patient = this.createClient('patient1');

    await this.wait(2000);
    
    doctor.disconnect();
    patient.disconnect();
    
    this.log('✅ Connection test completed\n');
  }

  // Test 2: Real-time Messaging
  async testMessaging() {
    this.log('\n💬 TEST 2: Real-time Messaging');
    
    const doctor = this.createClient('doctor1');
    const patient = this.createClient('patient1');

    await this.wait(1000);

    // Doctor sends message to patient
    doctor.emit('sendMessage', {
      receiverId: 'patient1',
      message: 'Hello patient, how are you feeling today?',
      messageType: 'text'
    });

    await this.wait(1000);

    // Patient replies
    patient.emit('sendMessage', {
      receiverId: 'doctor1',
      message: 'Hello doctor, I am feeling much better!',
      messageType: 'text'
    });

    await this.wait(2000);
    
    doctor.disconnect();
    patient.disconnect();
    
    this.log('✅ Messaging test completed\n');
  }

  // Test 3: Typing Indicators
  async testTypingIndicators() {
    this.log('\n⌨️  TEST 3: Typing Indicators');
    
    const doctor = this.createClient('doctor1');
    const patient = this.createClient('patient1');

    await this.wait(1000);

    // Doctor starts typing
    doctor.emit('typing', { receiverId: 'patient1', isTyping: true });
    
    await this.wait(1000);

    // Doctor stops typing
    doctor.emit('typing', { receiverId: 'patient1', isTyping: false });

    await this.wait(1000);

    // Patient starts typing
    patient.emit('typing', { receiverId: 'doctor1', isTyping: true });
    
    await this.wait(2000);

    // Patient stops typing
    patient.emit('typing', { receiverId: 'doctor1', isTyping: false });

    await this.wait(1000);
    
    doctor.disconnect();
    patient.disconnect();
    
    this.log('✅ Typing indicators test completed\n');
  }

  // Test 4: Read Receipts
  async testReadReceipts() {
    this.log('\n👁️  TEST 4: Read Receipts');
    
    const doctor = this.createClient('doctor1');
    const patient = this.createClient('patient1');

    await this.wait(1000);

    // Doctor sends message
    doctor.emit('sendMessage', {
      receiverId: 'patient1',
      message: 'Please confirm you received this message',
      messageType: 'text'
    });

    await this.wait(1000);

    // Patient marks messages as read
    patient.emit('markAsRead', { senderId: 'doctor1' });

    await this.wait(2000);
    
    doctor.disconnect();
    patient.disconnect();
    
    this.log('✅ Read receipts test completed\n');
  }

  // Test 5: Online Status
  async testOnlineStatus() {
    this.log('\n🟢 TEST 5: Online Status');
    
    const doctor = this.createClient('doctor1');
    
    await this.wait(1000);

    // Check patient status (should be offline)
    doctor.emit('getUserStatus', { userId: 'patient1' });

    await this.wait(1000);

    // Patient comes online
    const patient = this.createClient('patient1');

    await this.wait(1000);

    // Check patient status again (should be online)
    doctor.emit('getUserStatus', { userId: 'patient1' });

    await this.wait(1000);

    // Patient goes offline
    patient.disconnect();

    await this.wait(2000);
    
    doctor.disconnect();
    
    this.log('✅ Online status test completed\n');
  }

  // Test 6: Multiple Messages
  async testMultipleMessages() {
    this.log('\n📨 TEST 6: Multiple Messages');
    
    const doctor = this.createClient('doctor1');
    const patient = this.createClient('patient1');

    await this.wait(1000);

    // Send multiple messages rapidly
    const messages = [
      'How are you today?',
      'Any symptoms?',
      'Take your medication',
      'Schedule next appointment'
    ];

    for (let i = 0; i < messages.length; i++) {
      doctor.emit('sendMessage', {
        receiverId: 'patient1',
        message: messages[i],
        messageType: 'text'
      });
      await this.wait(500);
    }

    // Patient responds
    patient.emit('sendMessage', {
      receiverId: 'doctor1',
      message: 'Thank you doctor, I will follow your advice',
      messageType: 'text'
    });

    await this.wait(2000);
    
    doctor.disconnect();
    patient.disconnect();
    
    this.log('✅ Multiple messages test completed\n');
  }

  // Test 7: Error Handling
  async testErrorHandling() {
    this.log('\n❌ TEST 7: Error Handling');
    
    const doctor = this.createClient('doctor1');

    await this.wait(1000);

    // Try to send message to non-existent user
    doctor.emit('sendMessage', {
      receiverId: 'nonexistent_user',
      message: 'This should fail',
      messageType: 'text'
    });

    await this.wait(2000);
    
    doctor.disconnect();
    
    this.log('✅ Error handling test completed\n');
  }

  // Run all tests
  async runAllTests() {
    console.log('🧪 Starting Socket.IO Real-time Chat Tests\n');
    console.log('Server URL:', this.serverUrl);
    console.log('Make sure your server is running on the specified URL\n');

    try {
      await this.testConnection();
      await this.testMessaging();
      await this.testTypingIndicators();
      await this.testReadReceipts();
      await this.testOnlineStatus();
      await this.testMultipleMessages();
      await this.testErrorHandling();

      this.log('\n🎉 All tests completed successfully!');
      this.log(`Total test events logged: ${this.testResults.length}`);
      
    } catch (error) {
      this.log(`\n💥 Test failed with error: ${error.message}`);
    }
  }

  // Generate test report
  generateReport() {
    console.log('\n📊 TEST REPORT');
    console.log('='.repeat(50));
    this.testResults.forEach(result => console.log(result));
    console.log('='.repeat(50));
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new SocketTester();
  
  // Handle command line arguments
  const args = process.argv.slice(2);
  const serverUrl = args[0] || 'http://localhost:3000';
  
  tester.serverUrl = serverUrl;
  
  tester.runAllTests().then(() => {
    tester.generateReport();
    process.exit(0);
  }).catch((error) => {
    console.error('Test suite failed:', error);
    process.exit(1);
  });
}

module.exports = SocketTester;
