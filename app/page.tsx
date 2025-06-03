"use client"

import React from "react"

import type { ReactElement } from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import {
  Users,
  Apple,
  Search,
  Plus,
  Minus,
  Calendar,
  Target,
  Flame,
  Droplets,
  Dumbbell,
  Moon,
  Weight,
  ChevronUp,
  Settings,
  LogOut,
  User,
  TrendingUp,
} from "lucide-react"

// Types
interface NutritionFact {
  id: string
  name: string
  serving_size: string
  calories: number
  protein_g: number
  total_carbs_g: number
  total_fat_g: number
  sodium_mg: number
  sugars_g: number
}

interface Exercise {
  id: string
  category: string
  exercise: string
  progress_metric: string
}

interface FoodEntry {
  id: string
  food: NutritionFact
  quantity: number
  meal_type: string
  date: string
}

interface WaterEntry {
  id: string
  amount: number
  date: string
  time: string
}

interface WorkoutEntry {
  id: string
  exercise: Exercise
  duration: number
  calories_burned: number
  sets?: number
  reps?: number
  weight?: number
  date: string
}

interface SleepEntry {
  id: string
  hours: number
  quality: number
  date: string
}

interface WeightEntry {
  id: string
  weight: number
  unit: string
  date: string
}

interface Goals {
  calories: number
  protein: number
  carbs: number
  fat: number
  water: number
  sleep: number
  weight_target: number
}

interface AppUser {
  id: string
  username: string
  email: string
  goals: Goals
}

// Positive affirmations for weight tab
const AFFIRMATIONS = [
  "Every healthy choice you make is an investment in your future self.",
  "Progress, not perfection, is the goal.",
  "Your body is capable of amazing things.",
  "Small steps lead to big changes.",
  "You are stronger than you think.",
  "Consistency beats perfection every time.",
  "Your health journey is unique and valuable.",
  "Every day is a new opportunity to care for yourself.",
  "You deserve to feel strong and confident.",
  "Trust the process and celebrate small wins.",
]

// Circular Progress Component
const CircularProgress = React.memo(
  ({
    value,
    max,
    size = 120,
    strokeWidth = 8,
    color = "#A51C30",
    label,
    unit = "",
  }: {
    value: number
    max: number
    size?: number
    strokeWidth?: number
    color?: string
    label: string
    unit?: string
  }) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const percentage = Math.min((value / max) * 100, 100)
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-2xl font-bold text-gray-900">{Math.round(value)}</div>
          <div className="text-xs text-gray-600 font-medium">{unit}</div>
          <div className="text-xs text-gray-500">{label}</div>
        </div>
      </div>
    )
  },
)

CircularProgress.displayName = "CircularProgress"

// GoalsDialog Component
const GoalsDialog = React.memo(() => {
  const [newGoals, setNewGoals] = useState<Goals>({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 67,
    water: 8,
    sleep: 8,
    weight_target: 150,
  })

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      // Assuming updateGoals is passed down from parent component
      // updateGoals(newGoals)
    },
    [newGoals],
  )

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewGoals((prev) => ({ ...prev, [name]: Number(value) }))
  }, [])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Update Goals
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Update Your Goals</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="calories">Calories</Label>
            <Input id="calories" type="number" name="calories" value={newGoals.calories} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="protein">Protein (g)</Label>
            <Input id="protein" type="number" name="protein" value={newGoals.protein} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="carbs">Carbs (g)</Label>
            <Input id="carbs" type="number" name="carbs" value={newGoals.carbs} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="fat">Fat (g)</Label>
            <Input id="fat" type="number" name="fat" value={newGoals.fat} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="water">Water (fl oz)</Label>
            <Input id="water" type="number" name="water" value={newGoals.water} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="sleep">Sleep (hours)</Label>
            <Input id="sleep" type="number" name="sleep" value={newGoals.sleep} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="weight_target">Weight Target (lbs)</Label>
            <Input
              id="weight_target"
              type="number"
              name="weight_target"
              value={newGoals.weight_target}
              onChange={handleInputChange}
            />
          </div>
          <Button onClick={handleSubmit} className="w-full bg-red-600 hover:bg-red-700">
            Update Goals
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
})

GoalsDialog.displayName = "GoalsDialog"

export default function MyHUDSpal(): ReactElement {
  const [currentView, setCurrentView] = useState("login")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null)
  const [nutritionData, setNutritionData] = useState<NutritionFact[]>([])
  const [exerciseData, setExerciseData] = useState<Exercise[]>([])
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([])
  const [waterEntries, setWaterEntries] = useState<WaterEntry[]>([])
  const [workoutEntries, setWorkoutEntries] = useState<WorkoutEntry[]>([])
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([])
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [exerciseSearchQuery, setExerciseSearchQuery] = useState("")
  const [currentAffirmation, setCurrentAffirmation] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoginMode, setIsLoginMode] = useState(true)

  // Memoized filtered data to prevent unnecessary re-renders
  const filteredFoods = useMemo(() => {
    if (searchQuery.trim() === "") {
      return nutritionData.slice(0, 20)
    }
    return nutritionData.filter((food) => food.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 20)
  }, [searchQuery, nutritionData])

  const filteredExercises = useMemo(() => {
    if (exerciseSearchQuery.trim() === "") {
      return exerciseData.slice(0, 20)
    }
    return exerciseData
      .filter((exercise) => exercise.exercise.toLowerCase().includes(exerciseSearchQuery.toLowerCase()))
      .slice(0, 20)
  }, [exerciseSearchQuery, exerciseData])

  // Load data
  useEffect(() => {
    loadNutritionData()
    loadExerciseData()
  }, [])

  // Cycle through affirmations
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAffirmation((prev) => (prev + 1) % AFFIRMATIONS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const loadNutritionData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/nutrition_facts-WuHMtwNPhC6V24rBM4IpHTkTzmT6Oh.csv",
      )
      const csvText = await response.text()
      const lines = csvText.split("\n")

      const data: NutritionFact[] = lines
        .slice(1)
        .map((line, index) => {
          const values = line.split(",")
          return {
            id: `food-${index}`,
            name: values[0] || "",
            serving_size: values[3] || "",
            calories: Number.parseFloat(values[4]) || 0,
            protein_g: Number.parseFloat(values[13]) || 0,
            total_carbs_g: Number.parseFloat(values[10]) || 0,
            total_fat_g: Number.parseFloat(values[6]) || 0,
            sodium_mg: Number.parseFloat(values[9]) || 0,
            sugars_g: Number.parseFloat(values[12]) || 0,
          }
        })
        .filter((item) => item.name && item.name.trim() !== "")

      setNutritionData(data)
    } catch (error) {
      console.error("Error loading nutrition data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadExerciseData = async () => {
    try {
      const response = await fetch(
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/exercises_progress_with_categories-qNUlDL96k5VmJXE0LB6YikfqJnbjLs.csv",
      )
      const csvText = await response.text()
      const lines = csvText.split("\n")

      const data: Exercise[] = lines
        .slice(1)
        .map((line, index) => {
          const values = line.split(",")
          return {
            id: `exercise-${index}`,
            category: values[0] || "",
            exercise: values[1] || "",
            progress_metric: values[2] || "",
          }
        })
        .filter((item) => item.exercise && item.exercise.trim() !== "")

      setExerciseData(data)
    } catch (error) {
      console.error("Error loading exercise data:", error)
    }
  }

  const handleLogout = useCallback(() => {
    setCurrentUser(null)
    setIsLoggedIn(false)
    setCurrentView("login")
    setFoodEntries([])
    setWaterEntries([])
    setWorkoutEntries([])
    setSleepEntries([])
    setWeightEntries([])
  }, [])

  // Calculate daily totals
  const todaysFoodEntries = useMemo(
    () => foodEntries.filter((entry) => entry.date === selectedDate),
    [foodEntries, selectedDate],
  )

  const totalCalories = useMemo(
    () => todaysFoodEntries.reduce((sum, entry) => sum + entry.food.calories * entry.quantity, 0),
    [todaysFoodEntries],
  )

  const totalProtein = useMemo(
    () => todaysFoodEntries.reduce((sum, entry) => sum + entry.food.protein_g * entry.quantity, 0),
    [todaysFoodEntries],
  )

  const totalCarbs = useMemo(
    () => todaysFoodEntries.reduce((sum, entry) => sum + entry.food.total_carbs_g * entry.quantity, 0),
    [todaysFoodEntries],
  )

  const totalFat = useMemo(
    () => todaysFoodEntries.reduce((sum, entry) => sum + entry.food.total_fat_g * entry.quantity, 0),
    [todaysFoodEntries],
  )

  const todaysWater = useMemo(
    () => waterEntries.filter((entry) => entry.date === selectedDate).reduce((sum, entry) => sum + entry.amount, 0),
    [waterEntries, selectedDate],
  )

  const todaysSleep = useMemo(
    () => sleepEntries.find((entry) => entry.date === selectedDate)?.hours || 0,
    [sleepEntries, selectedDate],
  )

  const latestWeight = useMemo(() => weightEntries[weightEntries.length - 1], [weightEntries])

  // Add functions
  const addFood = useCallback(
    (food: NutritionFact, quantity = 1, mealType = "meal") => {
      const newEntry: FoodEntry = {
        id: Date.now().toString(),
        food,
        quantity,
        meal_type: mealType,
        date: selectedDate,
      }
      setFoodEntries((prev) => [...prev, newEntry])
    },
    [selectedDate],
  )

  const addWater = useCallback(
    (amount: number) => {
      const newEntry: WaterEntry = {
        id: Date.now().toString(),
        amount,
        date: selectedDate,
        time: new Date().toLocaleTimeString(),
      }
      setWaterEntries((prev) => [...prev, newEntry])
    },
    [selectedDate],
  )

  const addWorkout = useCallback(
    (exercise: Exercise, duration: number, calories: number, sets?: number, reps?: number, weight?: number) => {
      const newEntry: WorkoutEntry = {
        id: Date.now().toString(),
        exercise,
        duration,
        calories_burned: calories,
        sets,
        reps,
        weight,
        date: selectedDate,
      }
      setWorkoutEntries((prev) => [...prev, newEntry])
    },
    [selectedDate],
  )

  const addSleep = useCallback(
    (hours: number, quality: number) => {
      const existingEntry = sleepEntries.find((entry) => entry.date === selectedDate)
      if (existingEntry) {
        setSleepEntries((prev) =>
          prev.map((entry) => (entry.date === selectedDate ? { ...entry, hours, quality } : entry)),
        )
      } else {
        const newEntry: SleepEntry = {
          id: Date.now().toString(),
          hours,
          quality,
          date: selectedDate,
        }
        setSleepEntries((prev) => [...prev, newEntry])
      }
    },
    [selectedDate, sleepEntries],
  )

  const addWeight = useCallback(
    (weight: number, unit: string) => {
      const newEntry: WeightEntry = {
        id: Date.now().toString(),
        weight,
        unit,
        date: selectedDate,
      }
      setWeightEntries((prev) => [...prev, newEntry])
    },
    [selectedDate],
  )

  const updateGoals = useCallback(
    (newGoals: Goals) => {
      if (currentUser) {
        setCurrentUser({ ...currentUser, goals: newGoals })
      }
    },
    [currentUser],
  )

  // Generate chart data
  const getWeightChartData = useCallback(() => {
    return weightEntries
      .slice(-30) // Last 30 entries
      .map((entry) => ({
        date: new Date(entry.date).toLocaleDateString(),
        weight: entry.weight,
        target: currentUser?.goals.weight_target || 150,
      }))
  }, [weightEntries, currentUser?.goals.weight_target])

  const getWorkoutChartData = useCallback(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split("T")[0]
    }).reverse()

    return last7Days.map((date) => {
      const dayWorkouts = workoutEntries.filter((entry) => entry.date === date)
      return {
        date: new Date(date).toLocaleDateString(),
        workouts: dayWorkouts.length,
        calories: dayWorkouts.reduce((sum, w) => sum + w.calories_burned, 0),
      }
    })
  }, [workoutEntries])

  // Login/Register Component with proper state isolation
  const AuthPage = React.memo(() => {
    // Form states are kept inside this component to prevent re-renders
    const [loginFormState, setLoginFormState] = useState({
      username: "",
      password: "",
    })

    const [registerFormState, setRegisterFormState] = useState({
      username: "",
      email: "",
      password: "",
    })

    // Memoized handlers to prevent re-creation on every render
    const handleLoginSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault()
        if (loginFormState.username && loginFormState.password) {
          const user: AppUser = {
            id: "1",
            username: loginFormState.username,
            email: `${loginFormState.username}@example.com`,
            goals: {
              calories: 2000,
              protein: 150,
              carbs: 250,
              fat: 67,
              water: 8,
              sleep: 8,
              weight_target: 150,
            },
          }
          setCurrentUser(user)
          setIsLoggedIn(true)
          setCurrentView("dashboard")
          // Clear form
          setLoginFormState({ username: "", password: "" })
        }
      },
      [loginFormState.username, loginFormState.password, setCurrentUser, setIsLoggedIn, setCurrentView],
    )

    const handleRegisterSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault()
        if (registerFormState.username && registerFormState.email && registerFormState.password) {
          const user: AppUser = {
            id: "1",
            username: registerFormState.username,
            email: registerFormState.email,
            goals: {
              calories: 2000,
              protein: 150,
              carbs: 250,
              fat: 67,
              water: 8,
              sleep: 8,
              weight_target: 150,
            },
          }
          setCurrentUser(user)
          setIsLoggedIn(true)
          setCurrentView("dashboard")
          // Clear form
          setRegisterFormState({ username: "", email: "", password: "" })
        }
      },
      [
        registerFormState.username,
        registerFormState.email,
        registerFormState.password,
        setCurrentUser,
        setIsLoggedIn,
        setCurrentView,
      ],
    )

    // Memoized input change handlers
    const handleLoginUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setLoginFormState((prev) => ({ ...prev, username: e.target.value }))
    }, [])

    const handleLoginPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setLoginFormState((prev) => ({ ...prev, password: e.target.value }))
    }, [])

    const handleRegisterUsernameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setRegisterFormState((prev) => ({ ...prev, username: e.target.value }))
    }, [])

    const handleRegisterEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setRegisterFormState((prev) => ({ ...prev, email: e.target.value }))
    }, [])

    const handleRegisterPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setRegisterFormState((prev) => ({ ...prev, password: e.target.value }))
    }, [])

    const toggleAuthMode = useCallback(() => {
      setIsLoginMode(!isLoginMode)
    }, [isLoginMode, setIsLoginMode])

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <Apple className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-red-600">myHUDSpal</span>
            </div>
            <CardTitle>{isLoginMode ? "Welcome Back" : "Create Account"}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoginMode ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="login-username">Username</Label>
                  <Input
                    id="login-username"
                    value={loginFormState.username}
                    onChange={handleLoginUsernameChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginFormState.password}
                    onChange={handleLoginPasswordChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                  Login
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="reg-username">Username</Label>
                  <Input
                    id="reg-username"
                    value={registerFormState.username}
                    onChange={handleRegisterUsernameChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reg-email">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    value={registerFormState.email}
                    onChange={handleRegisterEmailChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reg-password">Password</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    value={registerFormState.password}
                    onChange={handleRegisterPasswordChange}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                  Register
                </Button>
              </form>
            )}
            <div className="text-center mt-4">
              <button type="button" onClick={toggleAuthMode} className="text-red-600 hover:underline text-sm">
                {isLoginMode ? "Need an account? Register" : "Already have an account? Login"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  })

  AuthPage.displayName = "AuthPage"

  // Sidebar Navigation with proper scrolling
  const Sidebar = React.memo(() => (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
            <Apple className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg">myHUDSpal</span>
        </div>
      </div>

      {/* Navigation - Scrollable */}
      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-2">
          <button
            onClick={() => setCurrentView("dashboard")}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              currentView === "dashboard" ? "bg-red-600" : "hover:bg-gray-800"
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentView("foods")}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              currentView === "foods" ? "bg-red-600" : "hover:bg-gray-800"
            }`}
          >
            <Apple className="h-5 w-5" />
            <span>Foods</span>
          </button>

          <button
            onClick={() => setCurrentView("workouts")}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              currentView === "workouts" ? "bg-red-600" : "hover:bg-gray-800"
            }`}
          >
            <Dumbbell className="h-5 w-5" />
            <span>Workouts</span>
          </button>

          <button
            onClick={() => setCurrentView("weight")}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              currentView === "weight" ? "bg-red-600" : "hover:bg-gray-800"
            }`}
          >
            <Weight className="h-5 w-5" />
            <span>Weight</span>
          </button>
        </nav>
      </ScrollArea>

      {/* User Profile - Fixed at bottom */}
      <div className="p-4 border-t border-gray-700 flex-shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-800 transition-colors">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4" />
                </div>
                <span className="text-sm">{currentUser?.username}</span>
              </div>
              <ChevronUp className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <GoalsDialog />
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  ))

  Sidebar.displayName = "Sidebar"

  // Quick Add Components
  const QuickAddWater = React.memo(() => {
    const [amount, setAmount] = useState(8)
    const [open, setOpen] = useState(false)

    const handleSubmit = () => {
      addWater(amount)
      setAmount(8)
      setOpen(false)
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="bg-red-600 hover:bg-red-700 w-full">
            <Plus className="h-4 w-4 mr-1" />
            Add Water
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Log Water</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Amount (fl oz)</Label>
              <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            </div>
            <Button onClick={handleSubmit} className="w-full bg-red-600 hover:bg-red-700">
              Log Water
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  })

  QuickAddWater.displayName = "QuickAddWater"

  const QuickAddSleep = React.memo(() => {
    const [hours, setHours] = useState(8)
    const [quality, setQuality] = useState(5)
    const [open, setOpen] = useState(false)

    const handleSubmit = () => {
      addSleep(hours, quality)
      setHours(8)
      setQuality(5)
      setOpen(false)
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="bg-red-600 hover:bg-red-700 w-full">
            <Plus className="h-4 w-4 mr-1" />
            Log Sleep
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Log Sleep</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Hours Slept</Label>
              <Input type="number" step="0.5" value={hours} onChange={(e) => setHours(Number(e.target.value))} />
            </div>
            <div>
              <Label>Quality (1-10)</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
              />
            </div>
            <Button onClick={handleSubmit} className="w-full bg-red-600 hover:bg-red-700">
              Log Sleep
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  })

  QuickAddSleep.displayName = "QuickAddSleep"

  // Dashboard View
  const Dashboard = React.memo(() => (
    <div className="flex-1 p-6 bg-gray-50 overflow-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Calendar className="h-5 w-5 text-gray-600" />
          <span className="text-lg font-semibold">
            {new Date(selectedDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
        <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-auto" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Energy Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Flame className="h-5 w-5 text-red-600" />
              <span>Energy Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-around items-center">
              <CircularProgress
                value={totalCalories}
                max={currentUser?.goals.calories || 2000}
                color="#A51C30"
                label="Consumed"
                unit="kcal"
              />
              <CircularProgress
                value={workoutEntries
                  .filter((w) => w.date === selectedDate)
                  .reduce((sum, w) => sum + w.calories_burned, 0)}
                max={500}
                color="#A51C30"
                label="Burned"
                unit="kcal"
              />
              <CircularProgress
                value={Math.max(0, (currentUser?.goals.calories || 2000) - totalCalories)}
                max={currentUser?.goals.calories || 2000}
                color="#A51C30"
                label="Remaining"
                unit="kcal"
              />
            </div>
          </CardContent>
        </Card>

        {/* Macronutrient Targets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-red-600" />
              <span>Macronutrient Targets</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Energy</span>
                <span>
                  {Math.round(totalCalories)}/{currentUser?.goals.calories || 2000} kcal
                </span>
              </div>
              <Progress value={(totalCalories / (currentUser?.goals.calories || 2000)) * 100} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Protein</span>
                <span>
                  {Math.round(totalProtein)}/{currentUser?.goals.protein || 150}g
                </span>
              </div>
              <Progress value={(totalProtein / (currentUser?.goals.protein || 150)) * 100} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Net Carbs</span>
                <span>
                  {Math.round(totalCarbs)}/{currentUser?.goals.carbs || 250}g
                </span>
              </div>
              <Progress value={(totalCarbs / (currentUser?.goals.carbs || 250)) * 100} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Fat</span>
                <span>
                  {Math.round(totalFat)}/{currentUser?.goals.fat || 67}g
                </span>
              </div>
              <Progress value={(totalFat / (currentUser?.goals.fat || 67)) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Tracking Grid - Only Water and Sleep */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Water */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Droplets className="h-4 w-4 mr-2 text-red-600" />
              Water
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CircularProgress
              value={todaysWater}
              max={(currentUser?.goals.water || 8) * 8}
              size={80}
              color="#A51C30"
              label="fl oz"
              unit=""
            />
            <QuickAddWater />
          </CardContent>
        </Card>

        {/* Sleep */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Moon className="h-4 w-4 mr-2 text-red-600" />
              Sleep
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CircularProgress
              value={todaysSleep}
              max={currentUser?.goals.sleep || 8}
              size={80}
              color="#A51C30"
              label="hours"
              unit=""
            />
            <QuickAddSleep />
          </CardContent>
        </Card>
      </div>

      {/* Today's Foods */}
      {todaysFoodEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Apple className="h-5 w-5 text-red-600" />
              <span>Today's Foods</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysFoodEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{entry.food.name}</h4>
                    <p className="text-sm text-gray-600">
                      {Math.round(entry.food.calories * entry.quantity)} cal |{" "}
                      {(entry.food.protein_g * entry.quantity).toFixed(1)}g protein
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newQuantity = entry.quantity - 1
                        if (newQuantity <= 0) {
                          setFoodEntries((prev) => prev.filter((e) => e.id !== entry.id))
                        } else {
                          setFoodEntries((prev) =>
                            prev.map((e) => (e.id === entry.id ? { ...e, quantity: newQuantity } : e)),
                          )
                        }
                      }}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{entry.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setFoodEntries((prev) =>
                          prev.map((e) => (e.id === entry.id ? { ...e, quantity: e.quantity + 1 } : e)),
                        )
                      }}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  ))

  Dashboard.displayName = "Dashboard"

  // Foods View
  const FoodsView = React.memo(() => (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Food Database</h2>
        <p className="text-gray-600">Search and add foods to your daily intake</p>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search foods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Foods</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading foods...</div>
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {filteredFoods.map((food) => (
                  <div
                    key={food.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{food.name}</h4>
                      <p className="text-sm text-gray-600">
                        {food.calories} cal | {food.protein_g}g protein | {food.total_carbs_g}g carbs |{" "}
                        {food.total_fat_g}g fat
                      </p>
                      <p className="text-xs text-gray-500">Serving: {food.serving_size}</p>
                    </div>
                    <Button onClick={() => addFood(food)} className="bg-red-600 hover:bg-red-700 text-white">
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  ))

  FoodsView.displayName = "FoodsView"

  // Workouts View
  const WorkoutsView = React.memo(() => {
    const [duration, setDuration] = useState(30)
    const [calories, setCalories] = useState(200)
    const [sets, setSets] = useState(3)
    const [reps, setReps] = useState(10)
    const [weight, setWeight] = useState(50)

    const addWorkoutEntry = (selectedExercise: Exercise) => {
      addWorkout(selectedExercise, duration, calories, sets, reps, weight)
      setDuration(30)
      setCalories(200)
      setSets(3)
      setReps(10)
      setWeight(50)
    }

    return (
      <div className="flex-1 p-6 bg-gray-50">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Workouts</h2>
          <p className="text-gray-600">Track your exercises and view progress</p>
        </div>

        {/* Workout Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-red-600" />
              <span>Weekly Workout Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getWorkoutChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="workouts" fill="#A51C30" name="Workouts" />
                <Bar dataKey="calories" fill="#DC2626" name="Calories Burned" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Exercise Database */}
          <Card>
            <CardHeader>
              <CardTitle>Exercise Database</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search exercises..."
                  value={exerciseSearchQuery}
                  onChange={(e) => setExerciseSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {filteredExercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{exercise.exercise}</h4>
                        <p className="text-sm text-gray-600">Category: {exercise.category}</p>
                        <p className="text-xs text-gray-500">Metrics: {exercise.progress_metric}</p>
                      </div>
                      <Button
                        onClick={() => addWorkoutEntry(exercise)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Today's Workouts */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Workouts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workoutEntries
                  .filter((entry) => entry.date === selectedDate)
                  .map((entry) => (
                    <div key={entry.id} className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium">{entry.exercise.exercise}</h4>
                      <p className="text-sm text-gray-600">
                        {entry.duration} min | {entry.calories_burned} cal
                        {entry.sets && entry.reps && ` | ${entry.sets} sets × ${entry.reps} reps`}
                        {entry.weight && ` @ ${entry.weight} lbs`}
                      </p>
                      <p className="text-xs text-gray-500">Category: {entry.exercise.category}</p>
                    </div>
                  ))}
                {workoutEntries.filter((entry) => entry.date === selectedDate).length === 0 && (
                  <p className="text-gray-500 text-center py-8">No workouts logged today</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  })

  WorkoutsView.displayName = "WorkoutsView"

  // Weight View
  const WeightView = React.memo(() => {
    const [weight, setWeight] = useState(150)
    const [unit, setUnit] = useState("lbs")

    const handleAddWeight = () => {
      addWeight(weight, unit)
      setWeight(150)
    }

    return (
      <div className="flex-1 p-6 bg-gray-50">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Weight Tracking</h2>
          <p className="text-gray-600">Monitor your weight progress and stay motivated</p>
        </div>

        {/* Affirmation Card */}
        <Card className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-lg font-medium text-red-800 mb-2">Daily Motivation</p>
              <p className="text-red-700 italic">{AFFIRMATIONS[currentAffirmation]}</p>
            </div>
          </CardContent>
        </Card>

        {/* Weight Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-red-600" />
              <span>Weight Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={getWeightChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#A51C30" strokeWidth={2} name="Weight" />
                <Line type="monotone" dataKey="target" stroke="#DC2626" strokeDasharray="5 5" name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Log Weight */}
          <Card>
            <CardHeader>
              <CardTitle>Log Weight</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Weight</Label>
                <Input type="number" step="0.1" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
              </div>
              <div>
                <Label>Unit</Label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lbs">Pounds</SelectItem>
                    <SelectItem value="kg">Kilograms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddWeight} className="w-full bg-red-600 hover:bg-red-700">
                <Weight className="h-4 w-4 mr-2" />
                Log Weight
              </Button>
            </CardContent>
          </Card>

          {/* Weight Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Weight Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Current Weight:</span>
                  <span className="font-semibold">
                    {latestWeight ? `${latestWeight.weight} ${latestWeight.unit}` : "No data"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Target Weight:</span>
                  <span className="font-semibold">{currentUser?.goals.weight_target || 150} lbs</span>
                </div>
                <div className="flex justify-between">
                  <span>Progress to Goal:</span>
                  <span className="font-semibold text-red-600">
                    {latestWeight
                      ? `${Math.abs(latestWeight.weight - (currentUser?.goals.weight_target || 150)).toFixed(1)} lbs ${
                          latestWeight.weight > (currentUser?.goals.weight_target || 150) ? "to lose" : "to gain"
                        }`
                      : "Set your first weight"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Entries:</span>
                  <span className="font-semibold">{weightEntries.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  })

  WeightView.displayName = "WeightView"

  if (!isLoggedIn) {
    return <AuthPage />
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "foods":
        return <FoodsView />
      case "workouts":
        return <WorkoutsView />
      case "weight":
        return <WeightView />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      {renderCurrentView()}
    </div>
  )
}
