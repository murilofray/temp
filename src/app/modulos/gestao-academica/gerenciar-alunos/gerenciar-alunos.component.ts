import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ListboxModule } from 'primeng/listbox';
import { Router, RouterModule } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { AlunoService } from '../services/aluno/aluno.service';
import { AlergiaService } from '../services/alergia/alergia.service';
import { DocumentoAlunoService } from '../services/documento-aluno/documento-aluno.service';
import { TipoDocumentoService } from '../services/tipo-documento/tipo-documento.service';
import { FileUploadModule } from 'primeng/fileupload';
import { InputMaskModule } from 'primeng/inputmask';
import { Aluno } from '../model/aluno';
import { ValidationService } from '../services/validacao/validacao.service';
import { JwtPayload } from '../model/jwtPayload';
import { Escola } from '../model/escola';
import { Servidor } from '../model/servidor';
import { ServidorService } from 'src/app/comum/services/servidor.service';
import { jwtDecode } from 'jwt-decode';
import { Turma } from '../model/turma';
import { TurmaService } from '../services/turma/turma.service';
import { UserInfoService } from 'src/app/utils/services/user.service';
import { NivelAcessoEnum } from 'src/app/enums/NivelAcessoEnum';

@Component({
  selector: 'app-gerenciar-alunos',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    ToastModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    ToolbarModule,
    ListboxModule,
    RouterModule,
    AutoCompleteModule,
    RadioButtonModule,
    FileUploadModule,
    InputMaskModule,
    InputSwitchModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './gerenciar-alunos.component.html',
  styleUrls: ['./gerenciar-alunos.component.scss'],
})
export class GerenciarAlunosComponent {
  @ViewChild('dt1') dataTable: Table;

  alunoForm: FormGroup;
  editarAlunoForm: FormGroup;
  documentoForm: FormGroup;
  alergiaForm: FormGroup;
  cadastroAlunoDialogVisivel: boolean = false;
  editarAlunoDialogVisivel: boolean = false;
  displayDetalheDialog: boolean = false;
  displayDocumentoDialog: boolean = false;
  displayAlergiaDialog: boolean = false;
  displayConfirmDialog: boolean = false;

  mostrarDesabilitados: boolean = false;

  racas: any[] = [];

  loading: boolean = false;

  alergiaBuscar: string = '';
  alergias: any[] = []; // Armazena todas as alergias
  alergiasFiltradas: any[] = []; // Alergias filtradas com base na pesquisa
  alergiasSelecionadas: any[] = []; // Alergias selecionadas para o aluno

  tiposDocumento: any[] = []; //todos os TipoDocumento
  tipoDocumentoBuscar: string = '';
  tipoDocumentoSelecionado = null;
  tipoDocumentosFiltrados: any[] = [];

  alunoSelecionado: Aluno | null = null;
  alunos: Aluno[] = [];
  alunosFiltrados: Aluno[] = [];

  certidaoNascimentoFile: File | null = null;
  comprovanteFile: File | null = null;
  docFile: File | null = null;
  mostrarDescricao: boolean = false;
  turmas: Turma[] = [];
  escolas: Escola[] = [];
  escola: Escola;
  servidor: Servidor;
  user;
  userNiveis: string[];
  isLoading: boolean = false;

  public niveis = NivelAcessoEnum;

  constructor(
    private alunoService: AlunoService,
    private alergiaService: AlergiaService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private documentoService: DocumentoAlunoService,
    private tipoDocumentoService: TipoDocumentoService,
    private confirmationService: ConfirmationService,
    private validacaoService: ValidationService,
    private turmaService: TurmaService,
    private servidorService: ServidorService,
    public userService: UserInfoService,
    private router: Router,
  ) {
    this.alunoForm = this.formBuilder.group({
      nome: ['', Validators.required],
      ra: ['', Validators.required],
      nomeMae: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      celular: ['', Validators.required],
      cpf: ['', Validators.required],
      sexo: ['', Validators.nullValidator],
      raca: ['', Validators.nullValidator],
      beneficiarioBF: ['', Validators.nullValidator],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      bairro: ['', Validators.required],
      cep: ['', Validators.required],
      cidade: [{ value: '', disabled: true }, Validators.nullValidator],
      uf: [{ value: '', disabled: true }, Validators.nullValidator],
      alergiasSelecionadas: [[], Validators.nullValidator],
      certidaoNascimento: [null, Validators.required],
      comprovanteResidencia: [null, Validators.required],
    });
    this.editarAlunoForm = this.formBuilder.group({
      nome: ['', Validators.required],
      ra: [{ value: '', disabled: true }, Validators.required],
      nomeMae: ['', Validators.required],
      dataNascimento: [{ value: '', disabled: true }, Validators.required],
      celular: ['', Validators.required],
      cpf: [{ value: '', disabled: true }, Validators.required],
      sexo: ['', Validators.nullValidator],
      raca: ['', Validators.nullValidator],
      beneficiarioBF: ['', Validators.nullValidator],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      bairro: ['', Validators.required],
      cep: ['', Validators.required],
      cidade: [{ value: '', disabled: true }, Validators.nullValidator],
      uf: [{ value: '', disabled: true }, Validators.nullValidator],
    });
    this.documentoForm = this.formBuilder.group({
      tipoDocumento: [null, Validators.required],
      documento: [null, Validators.required],
      descricao: ['', Validators.nullValidator],
    });
    this.alergiaForm = this.formBuilder.group({
      alergiasSelecionadas: [[], Validators.nullValidator],
    });
    this.racas = [{ name: 'Amarelo' }, { name: 'Branco' }, { name: 'Indígena' }, { name: 'Pardo' }, { name: 'Preto' }];
  }

  ngOnInit() {
    this.isLoading = true;
    this.getUserInfo().then((data) => {
      this.carregarAlunos();
      this.carregarAlergias();
      this.carregarTiposDocumento();
      this.isLoading = false;
    });
  }

  async getUserInfo() {
    try {
      const tokenJWT = localStorage.getItem('jwt');
      if (tokenJWT) {
        const decodedToken: JwtPayload = jwtDecode(tokenJWT);
        const jwtServidor = decodedToken['servidor'];
        this.user = jwtServidor;
        // Armazena as descrições dos níveis de acesso em um array
        this.userNiveis = this.user.NivelAcessoServidor.map((nivel) => nivel.Acesso.descricao);

        if (!this.userNiveis.includes('ADMINISTRADOR')) {
          const servidorId = jwtServidor.id;

          let servidor = await this.servidorService.buscarServidorPorId(servidorId);
          this.servidor = servidor;
          this.escola = servidor.Escola;

          this.turmas = await this.turmaService.getTurmaByEscola(this.escola.id);
        }
      }
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao identificar o usuário.',
      });
    }
  }

  async carregarAlunos() {
    try {
      this.isLoading = true;

      const tokenJWT = localStorage.getItem('jwt');
      if (tokenJWT) {
        if (this.mostrarDesabilitados) {
          this.alunos = await this.alunoService.getDisabledAlunos(); // Busca alunos desabilitados
          this.alunosFiltrados = this.alunos;
        } else {
          this.alunos = await this.alunoService.getActiveAlunos(); // Busca alunos ativos
          this.alunosFiltrados = this.alunos;
          if (!this.userNiveis.includes('ADMINISTRADOR')) {
            //se não for admin, traz apenas os da escola do servidor logado
            //filtro por turmas da escola ou alunos sem turma
            this.alunosFiltrados = this.filtrarPorTuma(this.alunos);
          }
        }
      }
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao carregar alunos do banco de dados.',
      });
    } finally {
      this.isLoading = false;
    }
  }

  async carregarAlergias() {
    try {
      this.alergias = await this.alergiaService.index();
      this.alergiasFiltradas = [...this.alergias]; // Inicializa o filtro com todas as alergias
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar alergias.' });
    }
  }

  async carregarTiposDocumento() {
    try {
      this.tiposDocumento = await this.tipoDocumentoService.getTiposDocumento();
      this.tipoDocumentosFiltrados = [...this.tiposDocumento];
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar tipos de documento.' });
    }
  }

  onCertidaoNascimentoSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.certidaoNascimentoFile = input.files[0];
      this.alunoForm.patchValue({ certidaoNascimento: this.certidaoNascimentoFile }); //só para o formulário entender que ele não está vazio e liberar a validação
    }
  }

  onComprovanteSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.comprovanteFile = input.files[0];
      this.alunoForm.patchValue({ comprovanteResidencia: this.comprovanteFile }); //só para o formulário entender que ele não está vazio e liberar a validação
    }
  }

  onDocSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.docFile = input.files[0];
      this.documentoForm.patchValue({ documento: this.docFile }); //só para o formulário entender que ele não está vazio e liberar a validação
    }
  }

  atualizarExibicaoDescricao() {
    const tipoSelecionado = this.documentoForm.get('tipoDocumento')?.value;

    if (tipoSelecionado.descricao === 'Laudo' || tipoSelecionado.descricao === 'Documento do responsável') {
      this.mostrarDescricao = true;
    } else {
      this.mostrarDescricao = false;
    }
  }

  validarCep() {
    const cepControl = this.alunoForm.get('cep');

    this.validacaoService
      .validarCep(cepControl)
      .then((result) => {
        // preenche os campos do formulário
        this.alunoForm.patchValue({
          logradouro: result.logradouro,
          bairro: result.bairro,
          cidade: result.cidade,
          uf: result.uf,
        });
      })
      .catch((erro) => {
        // exibe mensagem de erro
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: erro,
        });
      });
  }

  validarCep2() {
    const cepControl = this.editarAlunoForm.get('cep');

    this.validacaoService
      .validarCep(cepControl)
      .then((result) => {
        // preenche os campos do formulário
        this.editarAlunoForm.patchValue({
          logradouro: result.logradouro,
          bairro: result.bairro,
          cidade: result.cidade,
          uf: result.uf,
        });
      })
      .catch((erro) => {
        // exibe mensagem de erro
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: erro,
        });
      });
  }

  async detalhesDialog() {
    // alergias do aluno
    const alergias = await this.alergiaService.getAlergiasByAlunoId(this.alunoSelecionado.id);
    if (alergias) {
      this.alunoSelecionado.alergias = alergias.map((a) => a.Alergia); // Extrai apenas as alergias
    }

    // IDs dos tipos de documento
    const tipoDocIds = (await this.tipoDocumentoService.getTipoDocIds()) as {
      certidaoNascimento: number;
      nis: number;
      rg: number;
      cpf: number;
      declaracaoVacinacao: number;
      comprovanteResidencia: number;
      autodeclaracaoRacial: number;
      documentosResponsavel: number;
      laudo: number;
    };

    this.alunoSelecionado.documentos = {
      certidaoNascimento: null,
      comprovanteResidencia: null,
      nis: null,
      rg: null,
      cpf: null,
      declaracaoVacinacao: null,
      autodeclaracaoRacial: null,
      documentosResponsavel: [],
      laudos: [],
    };

    // documentos do aluno
    try {
      const documentos = await this.documentoService.getDocumentosByAlunoId(this.alunoSelecionado.id);

      if (documentos && documentos.length > 0) {
        documentos.forEach((doc) => {
          if (doc.DocumentosScan.tipoDocumentoId === tipoDocIds.certidaoNascimento) {
            this.alunoSelecionado.documentos.certidaoNascimento = doc.DocumentosScan;
          } else if (doc.DocumentosScan.tipoDocumentoId === tipoDocIds.nis) {
            this.alunoSelecionado.documentos.nis = doc.DocumentosScan;
          } else if (doc.DocumentosScan.tipoDocumentoId === tipoDocIds.rg) {
            this.alunoSelecionado.documentos.rg = doc.DocumentosScan;
          } else if (doc.DocumentosScan.tipoDocumentoId === tipoDocIds.cpf) {
            this.alunoSelecionado.documentos.cpf = doc.DocumentosScan;
          } else if (doc.DocumentosScan.tipoDocumentoId === tipoDocIds.declaracaoVacinacao) {
            this.alunoSelecionado.documentos.declaracaoVacinacao = doc.DocumentosScan;
          } else if (doc.DocumentosScan.tipoDocumentoId === tipoDocIds.comprovanteResidencia) {
            this.alunoSelecionado.documentos.comprovanteResidencia = doc.DocumentosScan;
          } else if (doc.DocumentosScan.tipoDocumentoId === tipoDocIds.autodeclaracaoRacial) {
            this.alunoSelecionado.documentos.autodeclaracaoRacial = doc.DocumentosScan;
          } else if (doc.DocumentosScan.tipoDocumentoId === tipoDocIds.laudo) {
            // Se o documento for laudo, adiciona ao array de laudos
            this.alunoSelecionado.documentos.laudos.push(doc.DocumentosScan);
          } else if (doc.DocumentosScan.tipoDocumentoId === tipoDocIds.documentosResponsavel) {
            // Se o documento for do responsável, adiciona ao array de documentos do responsável
            this.alunoSelecionado.documentos.documentosResponsavel.push(doc.DocumentosScan);
          }
        });
      }
    } catch (error) {
      console.error(error);
    }

    this.displayDetalheDialog = true;
  }

  async editarDialog() {
    let celularFormatado;
    if (this.alunoSelecionado.celular != null) {
      celularFormatado = this.alunoSelecionado.celular.replace(/(\d{2})(\d{5})(\d{4})/, '($1)$2-$3');
    }
    let dataNascimentoFormatada;
    if (this.alunoSelecionado.dataNascimento != null) {
      dataNascimentoFormatada = new Date(this.alunoSelecionado.dataNascimento).toISOString().split('T')[0];
    }
    const racaSelecionada = this.racas.find((r) => r.name === this.alunoSelecionado.raca);

    this.editarAlunoForm.patchValue({
      nome: this.alunoSelecionado.nome,
      ra: this.alunoSelecionado.ra,
      dataNascimento: dataNascimentoFormatada,
      cpf: this.alunoSelecionado.cpf,
      sexo: this.alunoSelecionado.sexo,
      nomeMae: this.alunoSelecionado.nomeMae,
      celular: celularFormatado,
      cep: this.alunoSelecionado.cep,
      logradouro: this.alunoSelecionado.logradouro,
      numero: this.alunoSelecionado.numero,
      bairro: this.alunoSelecionado.bairro,
      cidade: this.alunoSelecionado.cidade,
      uf: this.alunoSelecionado.uf,
      raca: racaSelecionada,
      beneficiarioBF: this.alunoSelecionado.beneficiarioBF ? 'S' : 'N',
    });
    this.editarAlunoDialogVisivel = true;
  }

  async editarAluno() {
    this.loading = true;

    if (this.editarAlunoForm.valid) {
      const numero = this.editarAlunoForm.value.numero;
      if (numero <= 0) {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Número do endereço não pode ser negativo.' });
        return;
      }
      const cepControl = this.editarAlunoForm.get('cep');

      try {
        await this.validacaoService.validarCep(cepControl);
      } catch (erro) {
        // exibe mensagem de erro
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: erro,
        });
        this.loading = false;
        return;
      }

      const nome = this.editarAlunoForm.value.nome;
      const nomeMae = this.editarAlunoForm.value.nomeMae;
      const sexo = this.editarAlunoForm.value.sexo;
      const raca = this.editarAlunoForm.value.raca;
      let beneficiario = this.editarAlunoForm.value.beneficiarioBF;
      if (beneficiario == 'N') {
        beneficiario = false;
      } else {
        beneficiario = true;
      }
      const logradouro = this.editarAlunoForm.value.logradouro;
      const cep = this.editarAlunoForm.value.cep;
      const bairro = this.editarAlunoForm.value.bairro;
      const cidade = this.editarAlunoForm.get('cidade').value;
      const uf = this.editarAlunoForm.get('uf').value;

      const alunoId = this.alunoSelecionado.id;

      const resposta = await this.alunoService.update(
        alunoId,
        nome,
        nomeMae,
        sexo,
        raca.name,
        beneficiario,
        logradouro,
        cep,
        numero,
        bairro,
        cidade,
        uf,
      );

      if (resposta.error) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: resposta.data });
      } else {
        this.editarAlunoDialogVisivel = false;
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Aluno atualizado com sucesso!' });
        this.resetar();
      }

      this.loading = false;
    }
  }

  cadastroDocumentoDialog(aluno: Aluno) {
    this.alunoSelecionado = aluno;
    this.mostrarDescricao = false;
    this.displayDocumentoDialog = true;
  }

  cadastroAlergiaDialog(aluno: Aluno) {
    this.alunoSelecionado = aluno;
    this.displayAlergiaDialog = true;
  }

  async confirmarCadastro() {
    const tipoDocumento = this.documentoForm.get('tipoDocumento')?.value;
    const tiposDocumento = await this.tipoDocumentoService.index();
    // IDs dos tipos de documento
    const tipoDocIds = (await this.tipoDocumentoService.getTipoDocIds()) as {
      certidaoNascimento: number;
      nis: number;
      rg: number;
      cpf: number;
      declaracaoVacinacao: number;
      comprovanteResidencia: number;
      autodeclaracaoRacial: number;
      documentosResponsavel: number;
      laudo: number;
    };
    // IDs dos tipos de documentos que são únicos
    const tiposQueRequeremConfirmacao = [
      tipoDocIds.certidaoNascimento,
      tipoDocIds.nis,
      tipoDocIds.rg,
      tipoDocIds.cpf,
      tipoDocIds.declaracaoVacinacao,
      tipoDocIds.comprovanteResidencia,
      tipoDocIds.autodeclaracaoRacial,
    ];

    // Verifica se o tipo de documento requer confirmação
    if (tiposQueRequeremConfirmacao.includes(tipoDocumento.id)) {
      // Exibe o diálogo de confirmação
      this.displayConfirmDialog = true;
    } else {
      // Chama diretamente o cadastro do documento
      await this.cadastrarDocumento();
    }
  }

  async cadastrarDocumento() {
    this.loading = true;
    try {
      if (this.documentoForm.valid) {
        const tipoDocumento = this.documentoForm.get('tipoDocumento')?.value;
        const docFile = this.documentoForm.get('documento')?.value;
        const caminhoPasta = this.alunoSelecionado.ra + '/';
        const descricao = this.documentoForm.get('descricao')?.value;
        const resposta = await this.alunoService.adicionarDocumento(
          this.alunoSelecionado.id, // alunoId
          tipoDocumento.id, // tipoDocumentoId
          caminhoPasta, // caminho
          docFile, // pdf
          descricao,
        );

        if (resposta.error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: resposta.data,
          });
        } else {
          this.displayConfirmDialog = false;
          this.displayDocumentoDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Documento cadastrado com sucesso!',
          });
          this.documentoForm.reset();
        }
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Preencha todos os campos obrigatórios.',
        });
      }
    } catch (error) {
      console.error('Erro ao cadastrar documento:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao cadastrar documento.',
      });
    } finally {
      this.loading = false;
    }
  }

  async cadastrarAlergias() {
    this.loading = true;

    if (this.alergiaForm.valid) {
      const alergiasSelecionadasFormulario = this.alergiaForm.get('alergiasSelecionadas')?.value;
      const alergiasIds = alergiasSelecionadasFormulario.map((alergia: any) => alergia.id);
      if (alergiasSelecionadasFormulario != null) {
        const resposta = await this.alunoService.adicionarAlergias(this.alunoSelecionado.id, alergiasIds);

        if (resposta.error) {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: resposta.data });
        } else {
          this.displayAlergiaDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Alergias cadastradas!' });
          this.resetar();
        }
      } else {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Selecione ao menos 1 alergia.' });
      }

      this.loading = false;
    }
  }

  async cadastrarAluno() {
    this.loading = true;

    if (this.alunoForm.valid) {
      const ra = this.alunoForm.value.ra;

      // Verifica se RA e nome da mãe já estão cadastrados
      const alunoExistente = await this.alunoService.getByRAUnique(ra);
      if (alunoExistente) {
        const nomeMaeExistente = alunoExistente.nomeMae;
        const nomeMaeNovo = this.alunoForm.value.nomeMae;

        if (nomeMaeExistente === nomeMaeNovo) {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Aluno já cadastrado com o mesmo RA e nome da mãe.',
          });
          return;
        }
      }
      const numero = this.alunoForm.value.numero;
      if (numero <= 0) {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Número do endereço não pode ser negativo.',
        });
        return;
      }
      const cepControl = this.alunoForm.get('cep');

      try {
        await this.validacaoService.validarCep(cepControl);
      } catch (erro) {
        // exibe mensagem de erro
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: erro,
        });
        this.loading = false;
        return;
      }

      const cpf = this.alunoForm.value.cpf.replace(/\D/g, ''); // Remove caracteres não numéricos
      if (!this.validacaoService.validarCpf(cpf)) {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'CPF inválido. Por favor, insira um CPF válido.',
        });
        return;
      }

      const dataNascimentoControl = this.alunoForm.get('dataNascimento');
      if (!this.validacaoService.validarDataNascimento(dataNascimentoControl)) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'A data de nascimento não pode ser maior que a data atual.',
        });
        this.loading = false;
        return;
      }
      let alergiaIds = [];
      if (this.alunoForm.value.alergiasSelecionadas) {
        alergiaIds = this.alunoForm.value.alergiasSelecionadas.map((alergia) => alergia.id);
      }
      let tiposDocumento = await this.tipoDocumentoService.index();
      const certidaoNascimentoId = tiposDocumento.find((doc) => doc.descricao === 'CERTIDAO_NASCIMENTO')?.id;
      const comprovanteResidenciaId = tiposDocumento.find((doc) => doc.descricao === 'COMPROVANTE_RESIDENCIA')?.id;
      const documentos = [
        {
          tipoDocumentoId: certidaoNascimentoId, // ID para "CERTIDAO_NASCIMENTO"
          caminho: ra + '/',
          pdf: this.certidaoNascimentoFile,
          descricao: '',
        },
        {
          tipoDocumentoId: comprovanteResidenciaId, // ID para "COMPROVANTE_RESIDENCIA"
          caminho: ra + '/',
          pdf: this.comprovanteFile,
          descricao: '',
        },
      ];
      const nome = this.alunoForm.value.nome;
      const dataNascimento = new Date(this.alunoForm.value.dataNascimento);
      const nomeMae = this.alunoForm.value.nomeMae;
      const sexo = this.alunoForm.value.sexo;
      const raca = this.alunoForm.value.raca;
      let beneficiario = this.alunoForm.value.beneficiarioBF;
      if (beneficiario == 'N') {
        beneficiario = false;
      } else {
        beneficiario = true;
      }
      const cep = this.alunoForm.value.cep;
      const logradouro = this.alunoForm.value.logradouro;
      const bairro = this.alunoForm.value.bairro;
      const cidade = this.alunoForm.get('cidade').value;
      const uf = this.alunoForm.get('uf').value;
      const celular = this.alunoForm.value.celular;
      const celularFormatado = celular.replace(/\D/g, '');

      const resposta = await this.alunoService.criarAluno(
        nome,
        dataNascimento,
        nomeMae,
        celularFormatado,
        ra,
        cpf,
        sexo,
        raca.name,
        beneficiario,
        logradouro,
        cep,
        numero,
        bairro,
        cidade,
        uf,
        alergiaIds,
        documentos,
      );

      if (resposta.error) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: resposta.data });
      } else {
        this.cadastroAlunoDialogVisivel = false;
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Aluno cadastrado com sucesso!' });
        this.resetar();
      }

      this.loading = false;
    }
  }

  async deletarAluno() {
    const resposta = await this.alunoService.deletarAluno(this.alunoSelecionado.id);
    if (resposta.error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível deletar o aluno.' });
    }
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Aluno deletado!' });
    this.resetar();
  }

  async reativarAluno(aluno: Aluno) {
    const resposta = await this.alunoService.editarAluno(aluno.id, false);

    if (resposta.error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: resposta.data });
    } else {
      this.editarAlunoDialogVisivel = false;
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Aluno reativado com sucesso!' });
      this.resetar();
    }
  }

  buscarAlergias(event: any) {
    const query = event.query.toLowerCase();
    this.alergiasFiltradas = this.alergias.filter((alergia) => alergia.descricao.toLowerCase().includes(query));
  }

  buscarTipoDocumento(event: any) {
    const query = event.query.toLowerCase();
    this.tipoDocumentosFiltrados = this.tiposDocumento.filter((tipoDocumento) =>
      tipoDocumento.descricao.toLowerCase().includes(query),
    );
  }

  resetar() {
    this.carregarAlunos();
    this.dataTable.reset();
    this.alunoSelecionado = null;
    this.alunoForm.reset();
    this.alergiaForm.reset();
    this.editarAlunoForm.reset();
    this.documentoForm.reset();
    this.comprovanteFile = null;
    this.alergiasSelecionadas = [];
    this.certidaoNascimentoFile = null;
    this.alunoForm.patchValue({ comprovanteResidencia: null });
    this.alunoForm.patchValue({ certidaoNascimento: null });
  }

  verDocumento(caminho: string): void {
    this.documentoService.verPDF(caminho);
  }

  deletarAlunoDialog() {
    this.confirmationService.confirm({
      message: 'Deseja deletar esse aluno? Essa ação é irreversível.',
      header: 'Confirmação',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      rejectLabel: 'Cancelar',
      acceptLabel: 'Deletar',

      accept: () => {
        this.deletarAluno();
      },
    });
  }

  formatarCPF(cpf: string): string {
    if (!cpf) return '';
    cpf = cpf.replace(/\D/g, '');
    return cpf
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{2})$/, '$1-$2');
  }

  formatarCelular(celular: string): string {
    if (!celular) return '';
    celular = celular.replace(/\D/g, '');
    return celular.replace(/(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  }

  formatarData(data: string): string {
    if (!data) return '';

    const date = new Date(data);
    const dia = String(date.getUTCDate()).padStart(2, '0');
    const mes = String(date.getUTCMonth() + 1).padStart(2, '0');
    const ano = date.getUTCFullYear();

    return `${dia}/${mes}/${ano}`;
  }

  filterAlunos(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value.trim();

    // Se o campo está vazio, retorna todos os alunos
    if (!inputValue) {
      this.carregarAlunos(); 
      return;
    }

    const isNumber = !isNaN(Number(inputValue));

    if (isNumber) {
        // Filtra alunos pelo RA, considerando que a entrada pode ser apenas parte do RA
        this.alunosFiltrados = this.alunos.filter(aluno => 
            aluno.ra.trim().startsWith(inputValue.trim())
        );

        if (!this.userNiveis.includes('ADMINISTRADOR')) {
            this.alunosFiltrados = this.filtrarPorTuma(this.alunosFiltrados);
        }
    } else {
      // Filtra alunos pelo nome
      this.alunosFiltrados = this.alunos.filter((aluno) => aluno.nome.toLowerCase().includes(inputValue.toLowerCase()));
      if (!this.userNiveis.includes('ADMINISTRADOR')) {
        this.alunosFiltrados = this.filtrarPorTuma(this.alunosFiltrados);
      }
    }
  }

  filtrarPorTuma(alunos: Aluno[]) {
    return alunos.filter((aluno) => aluno.turmaId === null || this.turmas.some((turma) => turma.id === aluno.turmaId));
  }

  onToggleMostrarDesabilitados(event: any) {
    this.mostrarDesabilitados = event.checked; // Atualiza a variável
    this.carregarAlunos(); // Recarrega os alunos com base no novo estado
  }

  goToVisualizarQuestionarios(aluno: Aluno) {
    this.router.navigate(['/academico/questionarios/aluno', { alunoId: aluno.id, visualizar: true }]);
  }
}

