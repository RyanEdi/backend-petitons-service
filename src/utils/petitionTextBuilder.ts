import petitionTemplateJson from '../templates/aposentadoria_pcd_obrigacao_fazer_df.json';

export type ClientData = {
  nomeAutor?: string;           
  estadoCivil?: string;         
  profissao?: string;          
  cpf?: string;                 
  rg?: string;                 
  enderecoCompleto?: string;   
  cep?: string;                
  emailAutor?: string;          
  enderecoEscritorio?: string;  
  enderecoDfIprev?: string;     
  valorDanoMoral?: string;      
  valorDaCausa?: string;        
  nomeAdvogado?: string;        
  ufOab?: string;               
  numeroOab?: string;           
  cidadeUf?: string;            
};

export function buildPetitionText(clientData: ClientData): string {
  const template = (petitionTemplateJson as any).petitionTemplate;
  const sortedSections = template.sections.sort(
    (a: any, b: any) => a.order - b.order,
  );

  let fullText: string = sortedSections
    .map((section: any) => section.text)
    .join('\n\n');

  const replacements: Record<string, string | undefined> = {
    '[NOME_COMPLETO_DO_AUTOR]': clientData.nomeAutor,
    '[ESTADO_CIVIL]': clientData.estadoCivil,
    '[PROFISSÃO]': clientData.profissao,
    '[CPF_COM_MASCARA]': clientData.cpf,
    '[RG]': clientData.rg,
    '[ENDERECO_COMPLETO]': clientData.enderecoCompleto,
    '[CEP_COM_MASCARA]': clientData.cep,
    '[EMAIL_AUTOR]': clientData.emailAutor,
    '[ENDERECO_ESCRITORIO]': clientData.enderecoEscritorio,
    '[ENDERECO_DF_IPREV]': clientData.enderecoDfIprev,
    '[VALOR_DANO_MORAL]': clientData.valorDanoMoral,
    '[VALOR_DA_CAUSA]': clientData.valorDaCausa,
    '[NOME_DO_ADVOGADO]': clientData.nomeAdvogado,
    '[UF]': clientData.ufOab,
    '[NUMERO_OAB]': clientData.numeroOab,
    '[CIDADE_UF]': clientData.cidadeUf,
  };

  for (const [placeholder, value] of Object.entries(replacements)) {
    if (value && value.trim() !== '') {
      const regex = new RegExp(placeholder, 'g');
      fullText = fullText.replace(regex, value);
    }
  }

  return fullText;
}