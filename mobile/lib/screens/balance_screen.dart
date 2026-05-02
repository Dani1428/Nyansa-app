import 'package:flutter/material.dart';
import '../core/api_service.dart';

class BalanceScreen extends StatefulWidget {
  final String? token;
  const BalanceScreen({super.key, this.token});

  @override
  State<BalanceScreen> createState() => _BalanceScreenState();
}

class _BalanceScreenState extends State<BalanceScreen> {
  final ApiService _api = ApiService();
  bool _isLoading = true;
  Map<String, dynamic> _balanceData = {};
  List<dynamic> _transactions = [];

  bool _isBalanceHidden = true;

  @override
  void initState() {
    super.initState();
    _loadBalance();
  }

  void _showSecurityCheck() {
    if (!_isBalanceHidden) {
      setState(() => _isBalanceHidden = true);
      return;
    }

    final String lastFour = _balanceData['phone'].toString().length >= 4 
        ? _balanceData['phone'].toString().substring(_balanceData['phone'].toString().length - 4)
        : "0000";

    final TextEditingController pinController = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: [
            const Icon(Icons.lock_outline, color: Color(0xFF1F7A63)),
            const SizedBox(width: 10),
            const Text('Vérification', style: TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Entrez les 4 derniers chiffres de votre numéro de téléphone pour voir le solde.',
              style: TextStyle(fontSize: 14, color: Colors.grey)),
            const SizedBox(height: 20),
            TextField(
              controller: pinController,
              keyboardType: TextInputType.number,
              maxLength: 4,
              obscureText: true,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, letterSpacing: 10),
              decoration: InputDecoration(
                counterText: "",
                filled: true,
                fillColor: Colors.grey.shade100,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                hintText: '----',
              ),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Annuler')),
          ElevatedButton(
            onPressed: () {
              if (pinController.text == lastFour) {
                Navigator.pop(ctx);
                setState(() => _isBalanceHidden = false);
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Code incorrect'), backgroundColor: Colors.red),
                );
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF1F7A63), foregroundColor: Colors.white),
            child: const Text('Valider'),
          ),
        ],
      ),
    );
  }

  Future<void> _loadBalance() async {
    setState(() => _isLoading = true);
    try {
      final profile = await _api.fetchProfile();
      final payments = await _api.fetchPayments();
      
      if (mounted) {
        setState(() {
          // Map backend stats to UI structure
          final stats = profile['stats'] ?? {};
          _balanceData = {
            'total_earned': stats['total_earned'] ?? 0,
            'pending': stats['pending'] ?? 0,
            'paid': stats['paid'] ?? 0,
            'total_approved': stats['total_approved'] ?? 0,
            'provider': 'Wave', // Default for now
            'phone': profile['phone_number'] ?? '00000000',
          };
          
          // Map payments to transactions
          _transactions = payments.map((p) => {
            'date': p['created_at']?.toString().substring(0, 10) ?? '',
            'amount': p['amount'],
            'type': 'payout',
            'label': 'Virement ${p['provider']}',
          }).toList();
          
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erreur: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF1F7A63)))
          : CustomScrollView(
              slivers: [
                // Premium Balance Card
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(20, 50, 20, 20),
                    child: Container(
                      height: 220,
                      width: double.infinity,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(28),
                        gradient: const LinearGradient(
                          colors: [Color(0xFF135B49), Color(0xFF1F7A63), Color(0xFF2ECC94)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF1F7A63).withOpacity(0.3),
                            blurRadius: 20,
                            offset: const Offset(0, 10),
                          ),
                        ],
                      ),
                      child: Stack(
                        children: [
                          // Decorative background circles
                          Positioned(
                            right: -50,
                            top: -50,
                            child: Container(
                              width: 200,
                              height: 200,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: Colors.white.withOpacity(0.05),
                              ),
                            ),
                          ),
                          Positioned(
                            left: -20,
                            bottom: -30,
                            child: Container(
                              width: 120,
                              height: 120,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: Colors.white.withOpacity(0.03),
                              ),
                            ),
                          ),
                          
                          // Card Content
                          Padding(
                            padding: const EdgeInsets.all(24),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          'NYANSA PASSE'.toUpperCase(),
                                          style: TextStyle(
                                            color: Colors.white.withOpacity(0.9),
                                            fontSize: 10,
                                            fontWeight: FontWeight.w900,
                                            letterSpacing: 1.5,
                                          ),
                                        ),
                                        const SizedBox(height: 4),
                                        const Text(
                                          'Agent Certifié',
                                          style: TextStyle(color: Colors.white70, fontSize: 11),
                                        ),
                                      ],
                                    ),
                                    Container(
                                      padding: const EdgeInsets.all(8),
                                      decoration: BoxDecoration(
                                        color: Colors.white.withOpacity(0.15),
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: IconButton(
                                        padding: EdgeInsets.zero,
                                        constraints: const BoxConstraints(),
                                        onPressed: _showSecurityCheck,
                                        icon: Icon(
                                          _isBalanceHidden ? Icons.visibility_off : Icons.visibility,
                                          color: Colors.white,
                                          size: 20,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const Spacer(),
                                Text(
                                  _isBalanceHidden ? '•••••• FCFA' : '${_balanceData['total_earned']} FCFA',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 34,
                                    fontWeight: FontWeight.w900,
                                    letterSpacing: -0.5,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: Colors.black.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(
                                    _isBalanceHidden 
                                      ? 'VÉRIFICATION REQUISE' 
                                      : 'DONT ${_balanceData['pending']} F EN ATTENTE',
                                    style: const TextStyle(
                                      color: Colors.white70, 
                                      fontSize: 10, 
                                      fontWeight: FontWeight.bold,
                                      letterSpacing: 0.5,
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 20),
                                Row(
                                  children: [
                                    _QuickStat(label: 'APP.', value: '${_balanceData['total_approved']}'),
                                    const SizedBox(width: 20),
                                    _QuickStat(
                                      label: 'PAYÉ', 
                                      value: _isBalanceHidden ? '••••' : '${_balanceData['paid']} F'
                                    ),
                                    const Spacer(),
                                    const Icon(Icons.nfc, color: Colors.white30, size: 24),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),

                // Payout method
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.04),
                            blurRadius: 8,
                          )
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Méthode de paiement',
                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                          const SizedBox(height: 16),
                          Row(
                            children: [
                              Container(
                                width: 44,
                                height: 44,
                                decoration: BoxDecoration(
                                  color: const Color(0xFF1B87E6).withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: const Icon(Icons.phone_android, color: Color(0xFF1B87E6)),
                              ),
                              const SizedBox(width: 12),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(_balanceData['provider'],
                                      style: const TextStyle(fontWeight: FontWeight.bold)),
                                  Text(_balanceData['phone'],
                                      style: TextStyle(color: Colors.grey.shade500, fontSize: 13)),
                                ],
                              ),
                              const Spacer(),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF2ECC71).withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: const Text('Actif',
                                    style: TextStyle(
                                        color: Color(0xFF2ECC71),
                                        fontWeight: FontWeight.bold,
                                        fontSize: 12)),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton.icon(
                              onPressed: () => _showWithdrawDialog(context),
                              icon: const Icon(Icons.account_balance_wallet_outlined),
                              label: const Text('Demander un retrait'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF1F7A63),
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.all(14),
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12)),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),

                // Transactions
                const SliverToBoxAdapter(
                  child: Padding(
                    padding: EdgeInsets.fromLTRB(16, 8, 16, 8),
                    child: Text('Transactions', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  ),
                ),
                SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (ctx, i) {
                      final tx = _transactions[i];
                      final isCredit = tx['type'] == 'credit';
                      return Container(
                        margin: const EdgeInsets.fromLTRB(16, 0, 16, 8),
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 40,
                              height: 40,
                              decoration: BoxDecoration(
                                color: isCredit
                                    ? const Color(0xFF2ECC71).withOpacity(0.1)
                                    : const Color(0xFF3498DB).withOpacity(0.1),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Icon(
                                isCredit ? Icons.arrow_downward : Icons.arrow_upward,
                                color: isCredit ? const Color(0xFF2ECC71) : const Color(0xFF3498DB),
                                size: 18,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(tx['label'],
                                      style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                                  Text(tx['date'],
                                      style: TextStyle(color: Colors.grey.shade500, fontSize: 11)),
                                ],
                              ),
                            ),
                            Text(
                              '${isCredit ? '+' : '-'}${tx['amount']} F',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: isCredit ? const Color(0xFF2ECC71) : const Color(0xFF3498DB),
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                    childCount: _transactions.length,
                  ),
                ),
              ],
            ),
    );
  }

  void _showWithdrawDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Demande de retrait'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Solde disponible : ${(_balanceData['total_earned'] as int) - (_balanceData['pending'] as int)} FCFA'),
            const SizedBox(height: 16),
            const TextField(
              decoration: InputDecoration(
                labelText: 'Montant à retirer',
                prefixText: 'FCFA ',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Annuler')),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Demande envoyée ! Traitement sous 24h via Wave.'),
                  backgroundColor: Color(0xFF1F7A63),
                ),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF1F7A63), foregroundColor: Colors.white),
            child: const Text('Confirmer'),
          ),
        ],
      ),
    );
  }
}

class _QuickStat extends StatelessWidget {
  final String label;
  final String value;
  const _QuickStat({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(color: Colors.white.withOpacity(0.6), fontSize: 9, fontWeight: FontWeight.bold, letterSpacing: 1),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
        ),
      ],
    );
  }
}

class _StatPill extends StatelessWidget {
  final String label;
  final String value;
  const _StatPill({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.2),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        children: [
          Text(value, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
          Text(label, style: const TextStyle(color: Colors.white70, fontSize: 11)),
        ],
      ),
    );
  }
}
