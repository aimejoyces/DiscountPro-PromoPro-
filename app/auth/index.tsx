import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuthStore } from '../../src/stores/authStore';
import { colors, typography, spacing } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { signIn, signUp, signInWithGoogle, loading, error, clearError, emailConfirmationPending, pendingEmail, resendConfirmation, clearEmailConfirmation } = useAuthStore();

  // Email confirmation screen
  if (emailConfirmationPending) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.confirmationCard}>
          <View style={styles.confirmationIcon}>
            <Ionicons name="mail" size={48} color={colors.onPrimary} />
          </View>
          <Text style={styles.confirmationTitle}>Check Your Email</Text>
          <Text style={styles.confirmationSubtitle}>
            We've sent a confirmation link to:
          </Text>
          <Text style={styles.confirmationEmail}>{pendingEmail}</Text>
          <Text style={styles.confirmationHint}>
            Click the link in the email to activate your account. If you don't see it, check your spam folder.
          </Text>

          {error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={14} color={colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={() => resendConfirmation(pendingEmail!)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.onPrimary} />
            ) : (
              <Text style={styles.submitButtonText}>Resend Confirmation Email</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              clearEmailConfirmation();
              clearError();
            }}
          >
            <Ionicons name="arrow-back" size={16} color={colors.primary} />
            <Text style={styles.backButtonText}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  const handleSubmit = async () => {
    setPasswordError('');

    if (isSignUp) {
      if (password !== confirmPassword) {
        setPasswordError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setPasswordError('Password must be at least 6 characters');
        return;
      }
      await signUp(email.trim(), password, displayName.trim());
    } else {
      await signIn(email.trim(), password);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    clearError();
    setPasswordError('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Ionicons name="bag" size={32} color={colors.onPrimary} />
              </View>
            </View>
            <Text style={styles.title}>
              {isSignUp ? 'Create Account' : 'Welcome back'}
            </Text>
            <Text style={styles.subtitle}>
              {isSignUp
                ? 'Join DiscountPro for exclusive deals and savings'
                : 'Enter your details to access your account'}
            </Text>
          </View>

          {/* Mode Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, !isSignUp && styles.toggleButtonActive]}
              onPress={() => !isSignUp || toggleMode()}
            >
              <Text style={[styles.toggleText, !isSignUp && styles.toggleTextActive]}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, isSignUp && styles.toggleButtonActive]}
              onPress={() => isSignUp || toggleMode()}
            >
              <Text style={[styles.toggleText, isSignUp && styles.toggleTextActive]}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {isSignUp && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={18} color={colors.outline} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="John Doe"
                    value={displayName}
                    onChangeText={setDisplayName}
                    autoCapitalize="words"
                    placeholderTextColor={colors.outline}
                  />
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={18} color={colors.outline} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="name@company.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  placeholderTextColor={colors.outline}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Password</Text>
                {!isSignUp && (
                  <TouchableOpacity>
                    <Text style={styles.forgotText}>Forgot password?</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={18} color={colors.outline} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                  placeholderTextColor={colors.outline}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.outline} />
                </TouchableOpacity>
              </View>
              {isSignUp && (
                <Text style={styles.hint}>Must be at least 6 characters</Text>
              )}
            </View>

            {isSignUp && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={18} color={colors.outline} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoComplete="password"
                    placeholderTextColor={colors.outline}
                  />
                </View>
              </View>
            )}

            {(error || passwordError) && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={14} color={colors.error} />
                <Text style={styles.errorText}>{error || passwordError}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isSignUp ? 'Create Account' : 'Sign In to DiscountPro'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
            <View style={styles.divider} />
          </View>

          {/* OAuth Buttons */}
          <View style={styles.oauthContainer}>
            <TouchableOpacity
              style={[styles.oauthButton, styles.googleButton]}
              onPress={signInWithGoogle}
              disabled={loading}
            >
              <Ionicons name="logo-google" size={20} color="#1877F2" />
              <Text style={styles.oauthButtonText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.oauthButton, styles.facebookButton]} disabled={loading}>
              <Ionicons name="logo-facebook" size={20} color="#fff" />
              <Text style={[styles.oauthButtonText, styles.facebookButtonText]}>Facebook</Text>
            </TouchableOpacity>
          </View>

          {/* Toggle Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {isSignUp ? "Don't have an account? " : 'Already have an account? '}
              <Text style={styles.footerLink} onPress={toggleMode}>
                {isSignUp ? 'Sign In' : 'Create an account'}
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: colors.surface,
  },
  scrollContainer: {
    flexGrow:1,
    justifyContent: 'center',
    padding: spacing[4],
    backgroundColor: colors.surface,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width:0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
    borderWidth:1,
    borderColor: colors.surfaceContainer,
  },
  header: {
    padding: spacing[8],
    paddingBottom: spacing[6],
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: spacing[4],
  },
  logo: {
    width:48,
    height:48,
    backgroundColor: colors.primary,
    borderRadius:8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.onSurface,
    marginBottom: spacing[1],
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.outline,
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    marginHorizontal: spacing[8],
    backgroundColor: colors.surfaceContainer,
    borderRadius:8,
    padding: spacing[1],
  },
  toggleButton: {
    flex:1,
    paddingVertical: spacing[2],
    alignItems: 'center',
    borderRadius:6,
  },
  toggleButtonActive: {
    backgroundColor: colors.surfaceContainerLowest,
    shadowColor: '#000',
    shadowOffset: { width:0, height:1 },
    shadowOpacity:0.1,
    shadowRadius:2,
    elevation:2,
  },
  toggleText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.outline,
  },
  toggleTextActive: {
    color: colors.primary,
  },
  form: {
    padding: spacing[8],
    paddingTop: spacing[6],
    gap: spacing[4],
  },
  inputGroup: {
    gap: spacing[1],
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.onSurfaceVariant,
    paddingLeft: spacing[1],
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[1],
  },
  forgotText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth:1,
    borderColor: colors.outlineVariant,
    borderRadius:8,
    paddingHorizontal: spacing[3],
    height:48,
  },
  inputIcon: {
    marginRight: spacing[3],
  },
  input: {
    flex:1,
    fontSize: typography.fontSize.base,
    color: colors.onSurface,
  },
  eyeIcon: {
    padding: spacing[1],
  },
  hint: {
    fontSize:10,
    color: colors.onSurfaceVariant,
    paddingLeft: spacing[1],
    marginTop: spacing[1],
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    backgroundColor: colors.errorContainer,
    padding: spacing[3],
    borderRadius:8,
  },
  errorText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.error,
    flex:1,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing[3],
    borderRadius:8,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width:0, height:2 },
    shadowOpacity:0.2,
    shadowRadius:4,
    elevation:4,
  },
  submitButtonText: {
    color: colors.onPrimary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  buttonDisabled: {
    opacity:0.5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[8],
    gap: spacing[3],
    // marginVertical: spacing[4],
  },
  divider: {
    flex:1,
    height:1,
    backgroundColor: colors.outlineVariant,
  },
  dividerText: {
    fontSize:10,
    fontWeight: typography.fontWeight.bold,
    color: colors.outline,
    letterSpacing:1,
  },
  oauthContainer: {
    flexDirection: 'row',
    padding: spacing[8],
    paddingTop: spacing[4],
    gap: spacing[4],
  },
  oauthButton: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingVertical: spacing[3],
    borderWidth:1,
    borderColor: colors.outlineVariant,
    borderRadius:8,
    backgroundColor: colors.surfaceContainerLowest,
  },
  googleButton: {
    // Google button specific
  },
  facebookButton: {
    backgroundColor: '#1877F2',
    borderColor: '#1877F2',
  },
  oauthButtonText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.onSurface,
  },
  facebookButtonText: {
    color: '#fff',
  },
  footer: {
    padding: spacing[6],
    borderTopWidth:1,
    borderTopColor: colors.surfaceContainer,
    backgroundColor: colors.surfaceContainerLow,
  },
  footerText: {
    textAlign: 'center',
    fontSize: typography.fontSize.sm,
    color: colors.outline,
  },
  footerLink: {
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },

  // Email confirmation styles
  confirmationCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[8],
    backgroundColor: colors.surface,
  },
  confirmationIcon: {
    width: 96,
    height: 96,
    backgroundColor: colors.primary,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[6],
  },
  confirmationTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.onSurface,
    marginBottom: spacing[2],
  },
  confirmationSubtitle: {
    fontSize: typography.fontSize.base,
    color: colors.outline,
    marginBottom: spacing[1],
  },
  confirmationEmail: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing[4],
  },
  confirmationHint: {
    fontSize: typography.fontSize.sm,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing[6],
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginTop: spacing[6],
    padding: spacing[3],
  },
  backButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
});
