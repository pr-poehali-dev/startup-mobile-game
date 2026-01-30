import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface GameState {
  balance: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  companyName: string;
  research: {
    marketing: number;
    development: number;
    design: number;
  };
  products: Array<{
    id: string;
    name: string;
    revenue: number;
    level: number;
  }>;
  achievements: {
    billionaireWay: boolean;
  };
}

type Screen = 'onboarding' | 'home' | 'research' | 'mvp' | 'shop' | 'stats';

export default function Index() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [onboardingStep, setOnboardingStep] = useState(0);
  
  const [gameState, setGameState] = useState<GameState>({
    balance: 1000,
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    companyName: 'Моя компания',
    research: {
      marketing: 0,
      development: 0,
      design: 0,
    },
    products: [],
    achievements: {
      billionaireWay: false,
    },
  });

  const [showAchievement, setShowAchievement] = useState(false);

  const onboardingSteps = [
    {
      title: 'Добро пожаловать в Кремниевую долину! 🚀',
      description: 'Почувствуй себя Гэвином Бэлсоном или Ричардом Хендриксом. Твоя цель — создать успешный стартап за 30 лет.',
    },
    {
      title: 'Баланс и уровни 💰',
      description: 'У тебя есть $1000 стартового капитала. Не как у Эрлиха с его инкубатором, но это начало!',
    },
    {
      title: 'Создавай MVP 💡',
      description: 'Создавай минимально жизнеспособные продукты. Помни: "This guy fucks!" — говорил Расс Ханнеман.',
    },
    {
      title: 'Проводи исследования 🔬',
      description: 'Вкладывай в маркетинг, разработку и дизайн. Даже Hooli начинала с малого.',
    },
  ];

  const handleOnboardingNext = () => {
    if (onboardingStep < onboardingSteps.length - 1) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setShowOnboarding(false);
      setCurrentScreen('home');
    }
  };

  const handleCreateMVP = () => {
    if (gameState.balance >= 200) {
      const newProduct = {
        id: `product-${Date.now()}`,
        name: `Продукт #${gameState.products.length + 1}`,
        revenue: 50 + Math.floor(Math.random() * 50),
        level: 1,
      };
      
      setGameState(prev => ({
        ...prev,
        balance: prev.balance - 200,
        products: [...prev.products, newProduct],
        xp: prev.xp + 20,
      }));
    }
  };

  const handleResearch = (type: keyof GameState['research'], cost: number) => {
    if (gameState.balance >= cost) {
      setGameState(prev => ({
        ...prev,
        balance: prev.balance - cost,
        research: {
          ...prev.research,
          [type]: prev.research[type] + 1,
        },
        xp: prev.xp + 10,
      }));
    }
  };

  const totalRevenue = gameState.products.reduce((sum, product) => {
    const researchBonus = (gameState.research.marketing + gameState.research.development + gameState.research.design) * 5;
    return sum + product.revenue + researchBonus;
  }, 0);

  useEffect(() => {
    if (gameState.xp >= gameState.xpToNextLevel) {
      setGameState(prev => ({
        ...prev,
        level: prev.level + 1,
        xp: prev.xp - prev.xpToNextLevel,
        xpToNextLevel: Math.floor(prev.xpToNextLevel * 1.5),
      }));
    }
  }, [gameState.xp, gameState.xpToNextLevel]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (totalRevenue > 0) {
        setGameState(prev => ({
          ...prev,
          balance: prev.balance + Math.floor(totalRevenue / 12),
        }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [totalRevenue]);

  useEffect(() => {
    if (totalRevenue >= 1000 && !gameState.achievements.billionaireWay) {
      setGameState(prev => ({
        ...prev,
        achievements: {
          ...prev.achievements,
          billionaireWay: true,
        },
      }));
      setShowAchievement(true);
      setTimeout(() => setShowAchievement(false), 5000);
    }
  }, [totalRevenue, gameState.achievements.billionaireWay]);

  if (currentScreen === 'onboarding') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 space-y-6 animate-fade-in">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">{onboardingSteps[onboardingStep].title}</h1>
            <p className="text-muted-foreground text-lg">
              {onboardingSteps[onboardingStep].description}
            </p>
          </div>

          <div className="space-y-3">
            <Progress value={(onboardingStep + 1) / onboardingSteps.length * 100} />
            <p className="text-sm text-center text-muted-foreground">
              Шаг {onboardingStep + 1} из {onboardingSteps.length}
            </p>
          </div>

          <Button onClick={handleOnboardingNext} className="w-full" size="lg">
            {onboardingStep === onboardingSteps.length - 1 ? 'Начать игру' : 'Далее'}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {showAchievement && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <Card className="p-4 shadow-lg border-2 border-primary">
            <div className="flex items-center gap-3">
              <Icon name="Trophy" size={32} className="text-primary" />
              <div>
                <h3 className="font-bold text-lg">Достижение разблокировано!</h3>
                <p className="text-sm text-muted-foreground">Путь миллиардера</p>
              </div>
            </div>
          </Card>
        </div>
      )}
      
      <div className="max-w-md mx-auto p-4 space-y-4">
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{gameState.companyName}</h1>
              <p className="text-sm text-muted-foreground">Уровень {gameState.level}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">${gameState.balance}</p>
              <p className="text-sm text-muted-foreground">+${totalRevenue}/час</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Опыт</span>
              <span>{gameState.xp} / {gameState.xpToNextLevel}</span>
            </div>
            <Progress value={(gameState.xp / gameState.xpToNextLevel) * 100} />
          </div>
        </Card>

        {currentScreen === 'home' && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold">Твои продукты</h2>
            {gameState.products.length === 0 ? (
              <Card className="p-6 text-center text-muted-foreground">
                <Icon name="PackageOpen" size={48} className="mx-auto mb-2 opacity-50" />
                <p>У тебя пока нет продуктов</p>
                <p className="text-sm">Создай свой первый MVP!</p>
                <p className="text-xs mt-2 italic">"Мы делаем мир лучше" — Гэвин Бэлсон</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {gameState.products.map((product) => (
                  <Card key={product.id} className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">Уровень {product.level}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">${product.revenue}/час</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {currentScreen === 'research' && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold">Исследования</h2>
            
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="TrendingUp" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Маркетинг</h3>
                    <p className="text-sm text-muted-foreground">Уровень {gameState.research.marketing}</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleResearch('marketing', 150)}
                  disabled={gameState.balance < 150}
                  size="sm"
                >
                  $150
                </Button>
              </div>
            </Card>

            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="Code" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Разработка</h3>
                    <p className="text-sm text-muted-foreground">Уровень {gameState.research.development}</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleResearch('development', 150)}
                  disabled={gameState.balance < 150}
                  size="sm"
                >
                  $150
                </Button>
              </div>
            </Card>

            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon name="Palette" size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Дизайн</h3>
                    <p className="text-sm text-muted-foreground">Уровень {gameState.research.design}</p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleResearch('design', 150)}
                  disabled={gameState.balance < 150}
                  size="sm"
                >
                  $150
                </Button>
              </div>
            </Card>
          </div>
        )}

        {currentScreen === 'mvp' && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold">Создание MVP</h2>
            
            <Card className="p-6 space-y-4 text-center">
              <Icon name="Lightbulb" size={64} className="mx-auto text-primary" />
              <h3 className="text-lg font-semibold">Новый продукт</h3>
              <p className="text-muted-foreground">
                Создай минимально жизнеспособный продукт и начни зарабатывать
              </p>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Стоимость: $200</p>
                <p className="text-sm text-muted-foreground">Доход: $50-100/час</p>
                <p className="text-xs italic text-muted-foreground mt-2">"Добро пожаловать в будущее" — Джаред Дуанн</p>
              </div>
              <Button 
                onClick={handleCreateMVP}
                disabled={gameState.balance < 200}
                className="w-full"
                size="lg"
              >
                Создать MVP за $200
              </Button>
            </Card>
          </div>
        )}

        {currentScreen === 'shop' && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold">Магазин</h2>
            <Card className="p-6 text-center text-muted-foreground">
              <Icon name="ShoppingBag" size={48} className="mx-auto mb-2 opacity-50" />
              <p>Скоро здесь появятся улучшения</p>
              <p className="text-xs mt-2 italic">"Tres Comas — текила миллиардеров" — Расс Ханнеман</p>
            </Card>
          </div>
        )}

        {currentScreen === 'stats' && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-semibold">Статистика</h2>
            
            <Card className="p-5 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Общий доход</span>
                <span className="font-semibold">${totalRevenue}/час</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Продуктов</span>
                <span className="font-semibold">{gameState.products.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Уровень компании</span>
                <span className="font-semibold">{gameState.level}</span>
              </div>
            </Card>

            <Card className="p-5 space-y-3">
              <h3 className="font-semibold">Исследования</h3>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Маркетинг</span>
                <span className="font-semibold">Ур. {gameState.research.marketing}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Разработка</span>
                <span className="font-semibold">Ур. {gameState.research.development}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Дизайн</span>
                <span className="font-semibold">Ур. {gameState.research.design}</span>
              </div>
            </Card>

            <Card className="p-5 space-y-3">
              <h3 className="font-semibold">Достижения</h3>
              {gameState.achievements.billionaireWay ? (
                <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                  <img 
                    src="https://cdn.poehali.dev/projects/4d317872-35f1-46d7-93e4-a02a7575ebb1/bucket/df687516-6862-4ed4-b339-978c1e45c859.png" 
                    alt="Tres Comas" 
                    className="w-16 h-16 object-contain"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-primary">Путь миллиардера</h4>
                    <p className="text-sm text-muted-foreground">Достигни $1000/час дохода</p>
                    <p className="text-xs italic mt-1">"Tres Comas — текила миллиардеров"</p>
                  </div>
                  <Icon name="Trophy" size={24} className="text-primary" />
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg opacity-50">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <Icon name="Lock" size={24} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Путь миллиардера</h4>
                    <p className="text-sm text-muted-foreground">Достигни $1000/час дохода</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-lg">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex justify-around items-center mb-3">
            <button
              onClick={() => setCurrentScreen('home')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentScreen === 'home' ? 'text-primary bg-primary/10' : 'text-muted-foreground'
              }`}
            >
              <Icon name="Home" size={24} />
              <span className="text-xs">Главная</span>
            </button>

            <button
              onClick={() => setCurrentScreen('research')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentScreen === 'research' ? 'text-primary bg-primary/10' : 'text-muted-foreground'
              }`}
            >
              <Icon name="FlaskConical" size={24} />
              <span className="text-xs">Исследования</span>
            </button>

            <button
              onClick={() => setCurrentScreen('mvp')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentScreen === 'mvp' ? 'text-primary bg-primary/10' : 'text-muted-foreground'
              }`}
            >
              <Icon name="Lightbulb" size={24} />
              <span className="text-xs">MVP</span>
            </button>

            <button
              onClick={() => setCurrentScreen('shop')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentScreen === 'shop' ? 'text-primary bg-primary/10' : 'text-muted-foreground'
              }`}
            >
              <Icon name="ShoppingBag" size={24} />
              <span className="text-xs">Магазин</span>
            </button>

            <button
              onClick={() => setCurrentScreen('stats')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                currentScreen === 'stats' ? 'text-primary bg-primary/10' : 'text-muted-foreground'
              }`}
            >
              <Icon name="BarChart3" size={24} />
              <span className="text-xs">Статистика</span>
            </button>
          </div>

          <a
            href="https://t.me/ultraproduct"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="text-2xl heart-beat">❤️</span>
            <span>Сделано с любовью</span>
          </a>
        </div>
      </div>
    </div>
  );
}