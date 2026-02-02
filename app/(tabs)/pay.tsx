import React, { useState, useEffect, JSX } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from 'react-native';

// ==================== TYPES ====================
type PackageId = 'daily' | 'weekly' | 'monthly' | 'q3' | 'q6' | 'yearly';

interface Package {
  id: PackageId;
  label: string;
  days: number;
  price: number;
  color: string;
}

interface PaymentMethod {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
}

// ==================== HARDCODED DATA ====================
const HARDCODED_DATA = {
  packages: [
    { id: 'daily', label: 'Daily', days: 1, price: 500, color: '#F0F0F0' },
    { id: 'weekly', label: 'Weekly', days: 7, price: 3300, color: '#E3F2FD' },
    { id: 'monthly', label: 'Monthly', days: 30, price: 13500, color: '#FFF8E1' },
    { id: 'q3', label: '3 Months', days: 90, price: 38000, color: '#E8F5E9' },
    { id: 'q6', label: '6 Months', days: 180, price: 72000, color: '#F3E5F5' },
    { id: 'yearly', label: 'Yearly', days: 365, price: 136500, color: '#FFEBEE' },
  ] as Package[],

  paymentMethods: [
    { id: 'mpesa', title: 'M-Pesa', icon: '📱', description: 'Pay with M-Pesa (Tanzania)', color: '#43A047' },
    { id: 'tigo_pesa', title: 'Tigo Pesa', icon: '💰', description: 'Pay with Tigo Pesa', color: '#E53935' },
    { id: 'airtel_money', title: 'Airtel Money', icon: '📶', description: 'Pay with Airtel Money', color: '#1E88E5' },
    { id: 'cash', title: 'Cash Payment', icon: '💵', description: 'Get code from agent', color: '#FB8C00' },
  ] as PaymentMethod[],

  businessNumber: '123456',
  supportPhone: '0654 123 456',
};

// ==================== MOCK FUNCTIONS ====================
const mockSubmitPayment = (pkg: PackageId, amount: number, txId: string, phone?: string): Promise<boolean> => {
  console.log('Mock payment submitted:', { pkg, amount, txId, phone });
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 1500);
  });
};

const mockActivateSubscription = (pkg: PackageId): void => {
  console.log('Mock subscription activated for:', pkg);
};

// ==================== COMPONENT ====================
const PaymentUI: React.FC = () => {
  // State management
  const [currentScreen, setCurrentScreen] = useState<'pricing' | 'method' | 'confirmation' | 'success'>('pricing');
  const [selectedPackage, setSelectedPackage] = useState<PackageId>('monthly');
  const [selectedMethod, setSelectedMethod] = useState<string>('mpesa');
  const [txId, setTxId] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(5);

  // Get selected package data
  const selectedPackageData = HARDCODED_DATA.packages.find(p => p.id === selectedPackage)!;
  const selectedMethodData = HARDCODED_DATA.paymentMethods.find(m => m.id === selectedMethod)!;

  // Countdown effect for success screen
  useEffect(() => {
    if (currentScreen === 'success' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (currentScreen === 'success' && countdown === 0) {
      mockActivateSubscription(selectedPackage);
      // In real app, you would navigate to main app here
      console.log('App should open now');
    }
  }, [currentScreen, countdown, selectedPackage]);

  // Calculate daily rate
  const calculateDailyRate = (price: number, days: number): number => {
    return Math.round(price / days);
  };

  // Calculate savings compared to daily rate
  const calculateSavings = (pkg: Package): number => {
    if (pkg.id === 'daily') return 0;
    const dailyRate = calculateDailyRate(pkg.price, pkg.days);
    return (500 - dailyRate) * pkg.days;
  };

  // Handle payment submission
  const handleSubmitPayment = async (): Promise<void> => {
    if (!txId.trim()) {
      alert('Please enter Transaction ID');
      return;
    }

    setIsLoading(true);
    const success = await mockSubmitPayment(
      selectedPackage,
      selectedPackageData.price,
      txId,
      phone || undefined
    );
    setIsLoading(false);

    if (success) {
      setCurrentScreen('success');
    } else {
      alert('Payment verification failed. Please try again.');
    }
  };

  // ==================== SCREEN RENDERERS ====================
  const renderPricingScreen = (): JSX.Element => {  
    const dailyRate = calculateDailyRate(selectedPackageData.price, selectedPackageData.days);

    console.log("Dayily Rate: ", dailyRate)

    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Plan</Text>
          <Text style={styles.subtitle}>Pay once. Use daily.</Text>
        </View>

        {/* Savings Badge */}
        <View style={styles.savingsBadge}>
          <Text style={styles.savingsText}>
            ⚡ BONUS: Save TZS 45,000 with yearly plan!
          </Text>
        </View>

        {/* Package Cards */}
        <ScrollView style={styles.packagesContainer}>
          {HARDCODED_DATA.packages.map((pkg) => {
            const isSelected = selectedPackage === pkg.id;
            const pkgDailyRate = calculateDailyRate(pkg.price, pkg.days);
            const savings = calculateSavings(pkg);

            return (
              <TouchableOpacity
                key={pkg.id}
                style={[
                  styles.packageCard,
                  { backgroundColor: pkg.color },
                  isSelected && styles.selectedCard,
                ]}
                onPress={() => setSelectedPackage(pkg.id)}>
                
                {/* Most Popular Badge */}
                {pkg.id === 'monthly' && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>🏆 MOST POPULAR</Text>
                  </View>
                )}

                <View style={styles.packageHeader}>
                  <Text style={styles.packageLabel}>{pkg.label}</Text>
                  {isSelected && <Text style={styles.selectedIcon}>✓</Text>}
                </View>

                <Text style={styles.price}>
                  TZS {pkg.price.toLocaleString()}
                </Text>

                <View style={styles.details}>
                  <Text style={styles.days}>{pkg.days} days</Text>
                  <Text style={styles.dailyRate}>
                    {pkgDailyRate.toLocaleString()} TZS / day
                  </Text>
                </View>

                {/* Savings Indicator */}
                {pkg.id !== 'daily' && savings > 0 && (
                  <View style={styles.savings}>
                    <Text style={styles.savingsIcon}>💰</Text>
                    <Text style={styles.savingsAmount}>
                      Save {savings.toLocaleString()} TZS
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Action Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.payButton}
            onPress={() => setCurrentScreen('method')}>
            <Text style={styles.payButtonText}>
              Continue with {selectedPackageData.label} -{' '}
              {selectedPackageData.price.toLocaleString()} TZS
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.note}>
            💡 Pay with mobile money only. No bank cards needed.
          </Text>
        </View>
      </SafeAreaView>
    );
  };

  const renderMethodScreen = (): JSX.Element => {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {/* Amount Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Payment Summary</Text>
            <View style={styles.amountRow}>
              <Text style={styles.label}>Package:</Text>
              <Text style={styles.value}>{selectedPackageData.label.toUpperCase()}</Text>
            </View>
            <View style={styles.amountRow}>
              <Text style={styles.label}>Amount:</Text>
              <Text style={styles.amount}>TZS {selectedPackageData.price.toLocaleString()}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.amountRow}>
              <Text style={styles.totalLabel}>TOTAL:</Text>
              <Text style={styles.totalAmount}>TZS {selectedPackageData.price.toLocaleString()}</Text>
            </View>
          </View>

          {/* Choose Payment Method */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose Payment Method</Text>
            
            {HARDCODED_DATA.paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodCard,
                  selectedMethod === method.id && { borderColor: method.color },
                ]}
                onPress={() => setSelectedMethod(method.id)}>
                <View style={styles.methodHeader}>
                  <Text style={styles.methodIcon}>{method.icon}</Text>
                  <View style={styles.methodInfo}>
                    <Text style={styles.methodTitle}>{method.title}</Text>
                    <Text style={styles.methodDesc}>{method.description}</Text>
                  </View>
                  {selectedMethod === method.id && (
                    <Text style={styles.checkIcon}>✓</Text>
                  )}
                </View>
                
                {selectedMethod === method.id && (
                  <View style={[styles.methodDetails, { backgroundColor: `${method.color}10` }]}>
                    <Text style={[styles.methodHint, { color: method.color }]}>
                      {method.id === 'mpesa' && 'Go to M-Pesa to complete payment'}
                      {method.id === 'tigo_pesa' && 'Go to Tigo Pesa'}
                      {method.id === 'airtel_money' && 'Go to Airtel Money'}
                      {method.id === 'cash' && 'Visit nearest agent for code'}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* M-Pesa Instructions */}
          {selectedMethod === 'mpesa' && (
            <View style={styles.instructionsCard}>
              <Text style={styles.instructionsTitle}>
                📋 How to Pay with M-Pesa
              </Text>
              
              {[
                'Dial *150*00#',
                'Select "Lipa kwa M-Pesa"',
                'Select "Pay Bill"',
                `Enter Business Number: ${HARDCODED_DATA.businessNumber}`,
                'Enter Reference Number: Your Phone Number',
                `Enter Amount: TZS ${selectedPackageData.price.toLocaleString()}`,
                'Enter PIN and confirm',
              ].map((step, index) => (
                <View key={index} style={styles.step}>
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setCurrentScreen('pricing')}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.confirmButton, { backgroundColor: '#2E7D32' }]}
            onPress={() => setCurrentScreen('confirmation')}>
            <Text style={styles.confirmButtonText}>
              I have paid - Continue
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  const renderConfirmationScreen = (): JSX.Element => {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {/* Progress Indicator */}
          <View style={styles.progress}>
            {['pricing', 'method', 'confirmation'].map((screen, index) => (
              <React.Fragment key={screen}>
                <View style={[
                  styles.progressStep,
                  (screen === 'pricing' || screen === 'method' || screen === 'confirmation') && styles.activeStep
                ]}>
                  <Text style={styles.progressText}>{index + 1}</Text>
                </View>
                {index < 2 && <View style={styles.progressLine} />}
              </React.Fragment>
            ))}
          </View>

          <View style={styles.header}>
            <Text style={styles.headerTitle}>Confirm Payment</Text>
            <Text style={styles.headerSubtitle}>
              Enter details from M-Pesa to verify
            </Text>
          </View>

          {/* Transaction ID Input */}
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>
              Transaction ID
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Example: QFX9AB123"
              value={txId}
              onChangeText={setTxId}
              autoCapitalize="characters"
            />
            <Text style={styles.inputHint}>
              ⓘ Found in M-Pesa SMS. Starts with letters.
            </Text>
          </View>

          {/* Phone Number (Optional) */}
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>
              Phone Number (Optional)
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Example: 0761234567"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <Text style={styles.inputHint}>
              ⓘ This helps link your payment.
            </Text>
          </View>

          {/* Payment Preview */}
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>You are confirming:</Text>
            
            <View style={styles.previewRow}>
              <Text>Package:</Text>
              <Text style={styles.previewValue}>
                {selectedPackageData.label.toUpperCase()}
              </Text>
            </View>
            
            <View style={styles.previewRow}>
              <Text>Amount:</Text>
              <Text style={styles.previewAmount}>
                TZS {selectedPackageData.price.toLocaleString()}
              </Text>
            </View>
            
            <View style={styles.previewRow}>
              <Text>Method:</Text>
              <Text style={styles.previewValue}>
                {selectedMethodData.title}
              </Text>
            </View>
          </View>

          {/* Important Notes */}
          <View style={styles.notesCard}>
            <Text style={styles.notesTitle}>🔔 Important Notes:</Text>
            
            {[
              'Don\'t close app until you get verification',
              'Verification takes 1-5 minutes normally',
              `If stuck, contact us: ${HARDCODED_DATA.supportPhone}`,
            ].map((note, index) => (
              <View key={index} style={styles.noteItem}>
                <Text style={styles.noteBullet}>•</Text>
                <Text style={styles.noteText}>{note}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setCurrentScreen('method')}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.submitButton,
              !txId.trim() && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmitPayment}
            disabled={!txId.trim() || isLoading}>
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Verifying...' : 'Confirm Payment'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  const renderSuccessScreen = (): JSX.Element => {
    return (
      <SafeAreaView style={styles.successContainer}>
        <View style={styles.successContent}>
          {/* Success Icon */}
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✓</Text>
          </View>

          <Text style={styles.successTitle}>Payment Successful! 🎉</Text>
          
          <Text style={styles.successMessage}>
            You have subscribed to {selectedPackageData.label} package
          </Text>

          {/* Transaction Details */}
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Transaction ID:</Text>
              <Text style={styles.detailValue}>{txId || 'TXN12345'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date:</Text>
              <Text style={styles.detailValue}>
                {new Date().toLocaleDateString()}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount:</Text>
              <Text style={styles.detailAmount}>
                TZS {selectedPackageData.price.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Next Steps */}
          <View style={styles.nextSteps}>
            <Text style={styles.nextStepsTitle}>Whats Next:</Text>
            
            {[
              `You got ${selectedPackageData.days} days of access`,
              `App will open automatically in ${countdown} seconds`,
              'You can check remaining days in account menu',
            ].map((step, index) => (
              <View key={index} style={styles.step}>
                <Text style={styles.stepIcon}>{`${index + 1}️⃣`}</Text>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => {
              mockActivateSubscription(selectedPackage);
              console.log('App opened');
            }}>
            <Text style={styles.homeButtonText}>
              Open App Now ({countdown})
            </Text>
          </TouchableOpacity>

          <Text style={styles.footerNote}>
            Thank you for choosing our service! 📱🇹🇿
          </Text>
        </View>
      </SafeAreaView>
    );
  };

  // ==================== MAIN RENDER ====================
  switch (currentScreen) {
    case 'pricing':
      return renderPricingScreen();
    case 'method':
      return renderMethodScreen();
    case 'confirmation':
      return renderConfirmationScreen();
    case 'success':
      return renderSuccessScreen();
    default:
      return renderPricingScreen();
  }
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  successContainer: {
    flex: 1,
    backgroundColor: '#2E7D32',
  },
  successContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 60,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    alignItems: 'center',
  },

  // Header styles
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#2E7D32',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#E8F5E9',
    marginTop: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },

  // Badge styles
  savingsBadge: {
    backgroundColor: '#FF9800',
    padding: 10,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  savingsText: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: '#FF5722',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // Package styles
  packagesContainer: {
    flex: 1,
    padding: 16,
  },
  packageCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#2E7D32',
    borderWidth: 2,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packageLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  selectedIcon: {
    fontSize: 20,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginVertical: 8,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  days: {
    color: '#666666',
  },
  dailyRate: {
    color: '#666666',
    fontWeight: '500',
  },
  savings: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  savingsIcon: {
    marginRight: 6,
  },
  savingsAmount: {
    color: '#2E7D32',
    fontWeight: '600',
    fontSize: 12,
  },

  // Summary styles
  summaryCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
    margin: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333333',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: '#666666',
  },
  value: {
    fontWeight: '600',
    color: '#333333',
  },
  amount: {
    fontWeight: 'bold',
    color: '#2E7D32',
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#DDDDDD',
    marginVertical: 12,
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333333',
  },
  totalAmount: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#2E7D32',
  },

  // Section styles
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333333',
  },

  // Method styles
  methodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#EEEEEE',
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  methodDesc: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  checkIcon: {
    fontSize: 20,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  methodDetails: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
  },
  methodHint: {
    fontSize: 12,
    fontWeight: '500',
  },

  // Instructions styles
  instructionsCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 20,
    margin: 16,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1B5E20',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumber: {
    backgroundColor: '#2E7D32',
    color: '#FFFFFF',
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    color: '#333333',
  },
  highlight: {
    fontWeight: 'bold',
    color: '#2E7D32',
  },

  // Progress styles
  progress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  progressStep: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#DDDDDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeStep: {
    backgroundColor: '#2E7D32',
  },
  progressText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: '#DDDDDD',
  },

  // Input styles
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  inputHint: {
    fontSize: 12,
    color: '#666666',
    marginTop: 8,
  },

  // Preview styles
  previewCard: {
    backgroundColor: '#F0F7FF',
    borderRadius: 12,
    padding: 20,
    margin: 16,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1E88E5',
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  previewValue: {
    fontWeight: '600',
    color: '#333333',
  },
  previewAmount: {
    fontWeight: 'bold',
    color: '#2E7D32',
  },

  // Notes styles
  notesCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    padding: 20,
    margin: 16,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#FF8F00',
  },
  noteItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  noteBullet: {
    color: '#FF8F00',
    marginRight: 8,
    fontWeight: 'bold',
  },
  noteText: {
    flex: 1,
    color: '#333333',
  },

  // Footer styles
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    flexDirection: 'row',
    gap: 12,
  },
  payButton: {
    backgroundColor: '#2E7D32',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  note: {
    textAlign: 'center',
    marginTop: 12,
    color: '#666666',
    fontSize: 12,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 2,
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 2,
    backgroundColor: '#2E7D32',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Success styles
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successIconText: {
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  detailsCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    color: '#666666',
  },
  detailValue: {
    fontWeight: '600',
    color: '#333333',
  },
  detailAmount: {
    fontWeight: 'bold',
    color: '#2E7D32',
    fontSize: 16,
  },
  nextSteps: {
    width: '100%',
    marginBottom: 24,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333333',
  },

  stepIcon: {
    marginRight: 12,
  },

  homeButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  homeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerNote: {
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default PaymentUI;