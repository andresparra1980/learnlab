import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Trophy, Gamepad2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-12">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Bienvenido a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              LearnLab
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            La plataforma educativa gamificada que transforma el aprendizaje en una aventura emocionante.
            Aprende, juega y alcanza tus metas educativas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/login">
                Comenzar Ahora
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link href="/register">
                Registrarse como Estudiante
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="text-lg px-8 py-6">
              <Link href="/register-teacher">
                Registrarse como Profesor
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          ¿Por qué elegir LearnLab?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardHeader>
              <BookOpen className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <CardTitle>Cursos Interactivos</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Contenido educativo diseñado para maximizar el aprendizaje y la retención.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Gamepad2 className="w-12 h-12 mx-auto text-green-600 mb-4" />
              <CardTitle>Juegos Educativos</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Aprende jugando con crucigramas, sopas de letras, ahorcado y más.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Trophy className="w-12 h-12 mx-auto text-yellow-600 mb-4" />
              <CardTitle>Sistema de Logros</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Gana puntos, desbloquea logros y compite con otros estudiantes.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="w-12 h-12 mx-auto text-purple-600 mb-4" />
              <CardTitle>Comunidad</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Conecta con otros estudiantes y profesores en un ambiente colaborativo.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 LearnLab. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
