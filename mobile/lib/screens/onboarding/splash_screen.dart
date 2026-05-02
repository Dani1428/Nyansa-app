import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'dart:async';
import '../login_screen.dart';
import '../home_screen.dart';
import '../../core/api_service.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with TickerProviderStateMixin {
  final String text = "NYANSA";
  late List<AnimationController> _letterControllers;
  late List<Animation<double>> _letterAnimations;

  // Controller global pour le micro-zoom et pulsation finale
  late AnimationController _globalController;
  late Animation<double> _globalScale;

  @override
  void initState() {
    super.initState();

    _letterControllers = List.generate(text.length, (index) {
      return AnimationController(
        vsync: this,
        duration: const Duration(milliseconds: 400),
      );
    });

    _letterAnimations = _letterControllers.map((controller) {
      return CurvedAnimation(
        parent: controller,
        curve: Curves.easeOutBack,
      );
    }).toList();

    _globalController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    );

    _globalScale = Tween<double>(begin: 1.0, end: 1.05).animate(
      CurvedAnimation(parent: _globalController, curve: Curves.easeInOut),
    );

    startAnimation();
  }

  void startAnimation() async {
    // 1. Apparition lettre par lettre
    for (int i = 0; i < _letterControllers.length; i++) {
      if (!mounted) return;
      await Future.delayed(const Duration(milliseconds: 150));
      _letterControllers[i].forward();
    }

    // 2. Micro-animation globale (léger zoom et pulse)
    if (mounted) {
      _globalController.repeat(reverse: true);
    }

    // 3. Initialisation API & Vérification Session
    final api = ApiService();
    await api.init();
    final hasToken = api.hasToken(); // Need to add this helper

    // Transition
    Timer(const Duration(seconds: 3), () {
      if (mounted) {
        Navigator.pushReplacement(
          context,
          PageRouteBuilder(
            pageBuilder: (context, animation, secondaryAnimation) =>
                hasToken ? const HomeScreen() : const LoginScreen(),
            transitionsBuilder:
                (context, animation, secondaryAnimation, child) {
              return FadeTransition(opacity: animation, child: child);
            },
            transitionDuration: const Duration(milliseconds: 800),
          ),
        );
      }
    });
  }

  @override
  void dispose() {
    for (var c in _letterControllers) {
      c.dispose();
    }
    _globalController.dispose();
    super.dispose();
  }

  Widget buildLetter(int index) {
    final controller = _letterControllers[index];
    final scaleAnimation = _letterAnimations[index];

    return FadeTransition(
      opacity: controller,
      child: ScaleTransition(
        scale: scaleAnimation,
        child: AnimatedBuilder(
          animation: scaleAnimation,
          builder: (context, child) {
            // Sécuriser les valeurs pour withOpacity (doit être entre 0.0 et 1.0)
            final double safeValue = scaleAnimation.value.clamp(0.0, 1.0);
            final double opacity = (0.8 + safeValue * 0.2).clamp(0.0, 1.0);

            return Container(
              margin: const EdgeInsets.symmetric(horizontal: 4),
              child: Text(
                text[index],
                style: GoogleFonts.outfit(
                  fontSize: 48,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 2.0,
                  color: const Color(0xFF1F7A63).withOpacity(opacity),
                  shadows: [
                    Shadow(
                      color: const Color(0xFF6BFE9C).withOpacity(safeValue * 0.5),
                      blurRadius: 15,
                    )
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7FAF7),
      body: Center(
        child: ScaleTransition(
          scale: _globalScale,
          child: Row(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(text.length, (index) {
              return buildLetter(index);
            }),
          ),
        ),
      ),
    );
  }
}
