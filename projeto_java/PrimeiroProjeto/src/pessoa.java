public class pessoa {
        private String nome;
        private boolean acordou;
        private boolean tomouCafe;
        private boolean vestiuRoupas;
    
        // Construtor para inicializar o objeto com o nome da pessoa
        public pessoa(String nome) {
            this.nome = nome;
            this.acordou = false;
            this.tomouCafe = false;
            this.vestiuRoupas = false;
        }
    
        // Método que simula o ato de acordar
        public void acordar() {
            System.out.println(nome + " está dormindo...");
            try {
                Thread.sleep(1000); // pausa de 1 segundo para simular o tempo de sono
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            this.acordou = true;
            System.out.println(nome + " acordou!");
        }
    
        // Método que simula a pessoa se espreguiçando
        public void espreguicar() {
            if (acordou) {
                System.out.println(nome + " está se espreguiçando.");
            } else {
                System.out.println(nome + " ainda não acordou para se espreguiçar.");
            }
        }
    
        // Método que simula a pessoa tomando café
        public void tomarCafe() {
            if (acordou) {
                System.out.println(nome + " está preparando o café...");
                try {
                    Thread.sleep(1000); // pausa para simular o preparo do café
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                this.tomouCafe = true;
                System.out.println(nome + " tomou seu café.");
            } else {
                System.out.println(nome + " precisa acordar primeiro para tomar café.");
            }
        }
    
        // Método que simula a pessoa se vestindo
        public void vestirRoupas() {
            if (acordou) {
                System.out.println(nome + " está escolhendo uma roupa...");
                try {
                    Thread.sleep(1000); // pausa para simular o tempo de se vestir
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                this.vestiuRoupas = true;
                System.out.println(nome + " se vestiu.");
            } else {
                System.out.println(nome + " ainda não acordou para se vestir.");
            }
        }
    
        // Método que verifica se a pessoa está pronta para sair
        public void sairDeCasa() {
            if (acordou && tomouCafe && vestiuRoupas) {
                System.out.println(nome + " está pronto para sair de casa.");
            } else {
                System.out.println(nome + " ainda não completou sua rotina matinal.");
            }
        }
    }
    

