import { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { type AppColors } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { useTransactions } from "@/context/TransactionsContext";

// types

type ButtonType = "number" | "action" | "operator" | "equals" | "expense";

interface CalcButton {
  title: string;
  type: ButtonType;
}

// layout data

const BUTTON_ROWS: CalcButton[][] = [
  [
    { title: "C", type: "action" },
    { title: "%", type: "action" },
    { title: "Delete", type: "action" },
    { title: "÷", type: "operator" },
  ],
  [
    { title: "7", type: "number" },
    { title: "8", type: "number" },
    { title: "9", type: "number" },
    { title: "X", type: "operator" },
  ],
  [
    { title: "4", type: "number" },
    { title: "5", type: "number" },
    { title: "6", type: "number" },
    { title: "-", type: "operator" },
  ],
  [
    { title: "1", type: "number" },
    { title: "2", type: "number" },
    { title: "3", type: "number" },
    { title: "+", type: "operator" },
  ],
  [
    { title: "EXPENSE", type: "expense" },
    { title: "0", type: "number" },
    { title: ".", type: "number" },
    { title: "=", type: "equals" },
  ],
];

// Screens at or above this width get treated as tablet/desktop and
// the calculator becomes a centered card instead of a full-bleed screen.
const WIDE_BREAKPOINT = 700;

// number helpers

function calculate(a: number, b: number, operator: string): number {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "X":
      return a * b;
    case "÷":
      return b === 0 ? NaN : a / b;
    default:
      return b;
  }
}

// Avoids floating point artifacts like 0.1 + 0.2 = 0.30000000000000004
function cleanNumber(value: number): string {
  if (!isFinite(value)) return "Error";
  return parseFloat(value.toPrecision(12)).toString();
}

// Adds thousand separators for display without touching the raw stored value
function formatForDisplay(raw: string): string {
  if (raw === "Error") return raw;
  const isNegative = raw.startsWith("-");
  const unsigned = isNegative ? raw.slice(1) : raw;
  const [intPart, decPart] = unsigned.split(".");
  const formattedInt =
    intPart === "" ? "0" : Number(intPart).toLocaleString("en-US");
  const withDecimal = decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
  return isNegative ? `-${withDecimal}` : withDecimal;
}

export default function CalculatorPage() {
  const { width } = useWindowDimensions();
  const isWide = width >= WIDE_BREAKPOINT;
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const buttonColors = useMemo(() => createButtonColors(colors), [colors]);
  const { addTransaction, totals } = useTransactions();

  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const clearAll = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const inputDigit = (digit: string) => {
    if (display === "Error" || waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
      return;
    }
    setDisplay(display === "0" ? digit : display + digit);
  };

  const inputDecimal = () => {
    if (display === "Error" || waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const backspace = () => {
    if (display === "Error" || waitingForOperand) {
      setDisplay("0");
      return;
    }
    const isSingleDigit = display.length <= 1 || (display.length === 2 && display.startsWith("-"));
    setDisplay(isSingleDigit ? "0" : display.slice(0, -1));
  };

  // Mimics the common "amount + tax%" calculator behaviour: with a
  // pending operator it takes a percentage of the running total,
  // otherwise it just divides the current number by 100.
  const applyPercent = () => {
    const value = parseFloat(display);
    if (isNaN(value)) return;
    const result =
      operator && previousValue !== null ? (previousValue * value) / 100 : value / 100;
    setDisplay(cleanNumber(result));
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display);
    if (isNaN(inputValue)) return;

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operator && !waitingForOperand) {
      const result = calculate(previousValue, inputValue, operator);
      setPreviousValue(result);
      setDisplay(cleanNumber(result));
    }

    setOperator(nextOperator);
    setWaitingForOperand(true);
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);
    if (operator && previousValue !== null && !isNaN(inputValue)) {
      const result = calculate(previousValue, inputValue, operator);
      setDisplay(cleanNumber(result));
      setPreviousValue(null);
      setOperator(null);
      setWaitingForOperand(true);
    }
  };

  // Logs the number currently on screen as an expense transaction (shared
  // with the Transactions and Reports tabs) and clears the display, ready
  // for the next entry.
  const handleExpense = () => {
    const value = parseFloat(display);
    if (!isNaN(value) && value !== 0) {
      addTransaction({
        title: "Calculator Entry",
        category: "Other",
        amount: -Math.abs(value),
        icon: "calculate",
      });
    }
    clearAll();
  };

  const handlePress = (button: CalcButton) => {
    switch (button.type) {
      case "number":
        button.title === "." ? inputDecimal() : inputDigit(button.title);
        break;
      case "action":
        if (button.title === "C") clearAll();
        else if (button.title === "Delete") backspace();
        else if (button.title === "%") applyPercent();
        break;
      case "operator":
        handleOperator(button.title);
        break;
      case "equals":
        handleEquals();
        break;
      case "expense":
        handleExpense();
        break;
    }
  };

  return (
    <View style={[styles.screen, isWide && styles.screenWide]}>
      <View style={[styles.calc, isWide ? styles.calcCard : styles.calcFull]}>
        <View style={styles.calcDisplay}>
          {totals.expenses > 0 && (
            <Text style={styles.expenseLabel}>
              Expenses logged: ${formatForDisplay(totals.expenses.toFixed(2))}
            </Text>
          )}
          <Text
            style={[styles.calcDisplayText, { fontSize: isWide ? 48 : 36 }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {formatForDisplay(display)}
          </Text>
        </View>

        <View style={styles.buttonSection}>
          {BUTTON_ROWS.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.buttonRow}>
              {row.map((button) => {
                const btnColors = buttonColors[button.type];
                return (
                  <TouchableOpacity
                    key={button.title}
                    style={[styles.button, { backgroundColor: btnColors.bg }]}
                    onPress={() => handlePress(button)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        { color: btnColors.text, fontSize: isWide ? 20 : 16 },
                      ]}
                    >
                      {button.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const createButtonColors = (COLORS: AppColors): Record<ButtonType, { bg: string; text: string }> => ({
  number: { bg: COLORS.surfaceContainerHigh, text: COLORS.onSurface },
  action: { bg: COLORS.surfaceContainerHigh, text: COLORS.onSurface },
  operator: { bg: COLORS.primary, text: COLORS.onPrimary },
  equals: { bg: COLORS.secondary, text: COLORS.onSecondary },
  expense: { bg: COLORS.tertiary, text: COLORS.onTertiary },
});

const createStyles = (COLORS: AppColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      width: "100%",
    },
    // On tablets/desktop the calculator becomes a centered, capped-width
    // card instead of stretching edge to edge.
    screenWide: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: COLORS.background,
      paddingVertical: 24,
    },
    calc: {
      flexDirection: "column",
    },
    calcFull: {
      flex: 1,
      width: "100%",
    },
    calcCard: {
      width: "100%",
      maxWidth: 460,
      height: "100%",
      maxHeight: 760,
      borderRadius: 28,
      overflow: "hidden",
      backgroundColor: COLORS.surfaceContainerLowest,
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
      elevation: 10,
    },
    calcDisplay: {
      flexBasis: 180,
      backgroundColor: COLORS.surfaceContainerHigh,
      justifyContent: "flex-end",
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    expenseLabel: {
      fontSize: 14,
      color: COLORS.onSurfaceVariant,
      marginBottom: 4,
      textAlign: "right",
    },
    calcDisplayText: {
      fontWeight: "300",
      textAlign: "right",
      color: COLORS.onSurface,
    },
    buttonSection: {
      flex: 1,
      padding: 8,
      gap: 8,
    },
    buttonRow: {
      flex: 1,
      flexDirection: "row",
      gap: 8,
    },
    button: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 12,
    },
    buttonText: {
      fontWeight: "bold",
    },
  });
