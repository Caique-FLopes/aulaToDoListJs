class Tarefa {
    constructor({ titulo, status }) {
        this.titulo = titulo;
        this.status = status != '' ? status : 'default';
        this.statusTasks = ['default', 'feito', 'nao-feito', 'incompleto'];
    }

    addTask() {
        const div = document.createElement('div');
        div.classList.add('tarefa');
        div.innerHTML = `
            <h2>${this.titulo}</h2>
            <button class="btnTarefa"></button>
            <input type="hidden" value="${this.status}">
        `;
        return div;
    }

    alterarStatus(tarefa) {
        let input = tarefa.querySelector('input');
        let indexStatusAtual = this.statusTasks.indexOf(input.value);

        let proximoIndex = (indexStatusAtual + 1) % this.statusTasks.length;
        input.value = this.statusTasks[proximoIndex];

        this.statusTasks.forEach((status) => tarefa.classList.remove(status));
        tarefa.classList.add(this.statusTasks[proximoIndex]);
    }
}

class ListaTarefa {
    constructor(listaTarefa) {
        this.listaTarefa = document.getElementById(listaTarefa);
        this.renderTarefas();
    }

    carregarTarefas() {
        try {
            const listaTarefa = JSON.parse(localStorage['tarefas']);
            return listaTarefa;
        } catch (error) {
            console.error('Erro ao buscar tarefas:', error);
        }
    }

    limparTarefas() {
        this.listaTarefa.innerHTML = '';
    }

    async renderTarefas() {
        this.limparTarefas();
        const listaTarefas = await this.carregarTarefas();
        listaTarefas.forEach((tarefa) => {
            const tarefaElement = new Tarefa(tarefa);
            this.addNovaTarefa(tarefaElement);
        });
        this.addEventoElementos(this.listaTarefa);
    }

    addNovaTarefa(tarefa) {
        this.listaTarefa.append(tarefa.addTask());
    }

    addEventoElementos(lista) {
        const tarefas = lista.querySelectorAll('.tarefa');
        tarefas.forEach((tarefa) => {
            const tarefaObj = new Tarefa(tarefa);
            tarefa
                .querySelector('.btnTarefa')
                .addEventListener('click', () =>
                    tarefaObj.alterarStatus(tarefa),
                );
        });
    }
}

class FormAddTarefa {
    constructor(form) {
        this.form = form;
        console.log(this.form, this.input);
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.addNovaTarefa(event.target.inputTarefa.value);
        });
    }

    guardarTarefa(novaTarefa) {
        const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
        tarefas.push(novaTarefa);
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
    }

    addNovaTarefa(titulo) {
        const info = {
            titulo: titulo,
            status: '',
        };

        const novaTarefa = new Tarefa(info);
        const listaTarefa = new ListaTarefa('listaTarefa');
        listaTarefa.addNovaTarefa(novaTarefa);
        this.guardarTarefa(info);
    }
}

const listaTarefa = new ListaTarefa('listaTarefa');
const addTarefa = new FormAddTarefa(formAddTarefa);
